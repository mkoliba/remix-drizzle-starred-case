import 'dotenv/config';
import invariant from 'tiny-invariant';
import { createUser } from '~/models/user.server';

invariant(process.env.DATABASE_PATH, 'DATABASE_PATH must be set');

async function seed() {
  await createUser({
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password',
  });
  console.log('New user created!');
}

seed();
