import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';
import path from 'path';

const __dirname = path.dirname(__filename);

type Env = {
  DATABASE_URL: string
}

export default defineConfig({
  datasource: {
    url: env<Env>('DATABASE_URL'),
  },
  schema: path.resolve(__dirname, '../database/schema.prisma'),
  migrations: {
    path: path.resolve(__dirname, '../database/migrations'),
    seed: `ts-node ${path.resolve(__dirname, '../database/seed.ts')}`,
  },
});