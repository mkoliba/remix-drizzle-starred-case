import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import db from '~/db.server';
import { InsertUser, SelectUser, usersTable } from '~/db/schema.server';

export async function getUserById(id: SelectUser['id']) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = (
    await db.select().from(usersTable).where(eq(usersTable.id, id))
  )[0];
  return rest;
}

export async function getUserByEmail(email: SelectUser['email']) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password, ...rest } = (
    await db.select().from(usersTable).where(eq(usersTable.email, email))
  )[0];
  return rest;
}

export async function createUser(
  newUserData: Pick<InsertUser, 'email' | 'password' | 'fullName'>
) {
  const hashedPassword = await bcrypt.hash(newUserData.password, 10);

  return db
    .insert(usersTable)
    .values({ ...newUserData, password: hashedPassword });
}
