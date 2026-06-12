import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Logger } from '../utils/logger';

const logger = new Logger('Prisma');

/**
 * Singleton de PrismaClient para evitar múltiples instancias en desarrollo.
 * Usa el driver adapter de MariaDB (mariadb) para soportar auth plugins modernos de MySQL 8.0.
 *
 * Configuración del pool:
 * - connectionLimit: 10 conexiones máximas (suficiente para desarrollo).
 * - acquireTimeout: 30s para tolerar picos de carga.
 * - keepAliveDelay: habilita TCP keep-alive para evitar que el servidor MariaDB
 *   cierre conexiones inactivas por wait_timeout.
 * - connectTimeout: 10s para el handshake inicial de conexión.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const dbUrl = new URL(connectionString);
const poolConfig = {
  host: dbUrl.hostname,
  port: Number(dbUrl.port) || 3306,
  user: dbUrl.username,
  password: dbUrl.password,
  database: dbUrl.pathname.replace(/^\//, ''),
  connectionLimit: Number(process.env.DATABASE_POOL_LIMIT) || 10,
  acquireTimeout: 30_000,
  connectTimeout: 10_000,
  keepAliveDelay: 10_000,
};

const adapter = new PrismaMariaDb(poolConfig, {
  onConnectionError: (err) => {
    logger.error('MariaDB connection error', { message: err.message, code: err.code });
  },
});

const prismaOptions: any = {
  adapter,
  log: [
    { emit: 'event', level: 'query' },
    { emit: 'event', level: 'info' },
    { emit: 'event', level: 'warn' },
    { emit: 'event', level: 'error' },
  ],
};

export const prisma = globalForPrisma.prisma || new PrismaClient(prismaOptions);

(prisma as any).$on('query', (e: any) => {
  logger.debug('Prisma Query', { query: e.query, params: e.params, duration: e.duration + 'ms' });
});

(prisma as any).$on('info', (e: any) => {
  logger.info('Prisma Info', { message: e.message });
});

(prisma as any).$on('warn', (e: any) => {
  logger.warn('Prisma Warn', { message: e.message });
});

(prisma as any).$on('error', (e: any) => {
  logger.error('Prisma Error', { message: e.message });
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
