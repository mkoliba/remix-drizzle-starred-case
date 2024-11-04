import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './db/migrations',
  schema: './db/schema.server.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH!,
  },
});
