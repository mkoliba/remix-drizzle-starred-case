import { InferSelectModel, sql, InferInsertModel } from 'drizzle-orm';
import {
  sqliteTable,
  text,
  integer,
  primaryKey,
} from 'drizzle-orm/sqlite-core';

export type SelectUser = InferSelectModel<typeof usersTable>;
export type InsertUser = InferInsertModel<typeof usersTable>;

export const usersTable = sqliteTable('users', {
  id: integer('id').primaryKey(),
  fullName: text('name').notNull(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  createdAt: text('createdAt')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
  updatedAt: text('updatedAt')
    .notNull()
    .default(sql`(CURRENT_TIMESTAMP)`),
});

export const favoriteJobsTable = sqliteTable(
  'favorite_jobs',
  {
    userId: integer('user_id').references(() => usersTable.id),
    jobId: integer('job_id'),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.jobId] }),
    };
  }
);
