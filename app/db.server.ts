import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import invariant from 'tiny-invariant';

invariant(process.env.DATABASE_PATH, 'DATABASE_PATH is not set');

const db = drizzle(new Database(process.env.DATABASE_PATH));
export default db;
