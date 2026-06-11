import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { Logger } from '../utils/logger';

const logger = new Logger('Prisma');

/**
 * Singleton de PrismaClient para evitar múltiples instancias en desarrollo.
 * Usa el driver adapter de MariaDB (mysql2) para soportar auth plugins modernos de MySQL 8.0.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL no está definida en las variables de entorno');
}

const adapter = new PrismaMariaDb(connectionString);

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
