/**
 * db-setup.ts — Script para crear las tablas directamente usando mysql2.
 * Esto evita el problema de autenticación de Prisma con MySQL 8.0.
 */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mysql = require('mysql2/promise');
import * as fs from 'fs';
import * as path from 'path';

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ DATABASE_URL no está definida');
    process.exit(1);
  }

  console.log('🔌 Conectando a MySQL vía mysql2...');

  // Parse connection string: mysql://user:pass@host:port/db
  const match = connectionString.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
  if (!match) {
    console.error('❌ DATABASE_URL no tiene formato válido');
    process.exit(1);
  }

  const [, user, password, host, port, database] = match;

  // Primero conectamos sin database para crearla si no existe
  const rootConnection = await mysql.createConnection({
    host,
    port: parseInt(port, 10),
    user,
    password,
  });

  console.log(`📦 Creando base de datos "${database}" si no existe...`);
  await rootConnection.execute(`CREATE DATABASE IF NOT EXISTS \`${database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
  await rootConnection.end();

  // Ahora conectamos a la base de datos específica
  const connection = await mysql.createConnection({
    host,
    port: parseInt(port, 10),
    user,
    password,
    database,
    multipleStatements: true,
  });

  console.log('🏗️  Ejecutando SQL de inicialización...');

  const sqlPath = path.join(__dirname, '..', '..', 'prisma', 'init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  // Ejecutar cada statement por separado para manejar errores mejor
  const statements = sql.split(';').filter(s => s.trim().length > 0);

  for (const statement of statements) {
    try {
      await connection.execute(statement + ';');
    } catch (err: any) {
      // Ignorar errores de "already exists" o foreign keys duplicados
      if (err.code === 'ER_DUP_KEYNAME' || err.code === 'ER_TABLE_EXISTS_ERROR' || err.code === 'ER_DUP_ENTRY' || err.code === 'ER_CANT_DROP_FIELD_OR_KEY' || err.message.includes('Duplicate')) {
        console.log(`   ⚠️  Ignorando (ya existe): ${statement.trim().split('\n')[0]}...`);
      } else {
        console.error(`   ❌ Error: ${err.message}`);
        console.error(`   SQL: ${statement.substring(0, 100)}...`);
      }
    }
  }

  await connection.end();
  console.log('✅ Tablas creadas exitosamente');
}

main().catch((err) => {
  console.error('❌ Error fatal:', err.message);
  process.exit(1);
});
