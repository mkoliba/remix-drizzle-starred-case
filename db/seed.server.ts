import 'dotenv/config';
import invariant from 'tiny-invariant';
import { createUser } from '~/models/user.server';
import bcrypt from 'bcryptjs';

invariant(process.env.DATABASE_PATH, 'DATABASE_PATH must be set');

async function seed() {
  await createUser({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: bcrypt.hashSync('password', 10),
  });
  console.log('New user created!');
}

seed();
