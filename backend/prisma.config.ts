import { defineConfig } from 'prisma/config';
import dotenv from 'dotenv';

// Prisma config skips auto-loading .env, so we load it manually
dotenv.config();

export default defineConfig({
  earlyAccess: true,
  schema: './prisma/schema.prisma',
  migrations: {
    path: './prisma/migrations',
  },
});
