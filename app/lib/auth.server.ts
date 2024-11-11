import bcrypt from 'bcryptjs';
import { Authenticator, AuthorizationError } from 'remix-auth';
import { sessionStorage } from '~/lib/session.server';
import { FormStrategy } from 'remix-auth-form';
import { SelectUser, usersTable } from '~/db/schema.server';
import { redirect } from '@remix-run/node';
import { getUserById } from '~/models/user.server';
import invariant from 'tiny-invariant';
import db from '~/db.server';
import { eq } from 'drizzle-orm';

const loginRoute = '/login';

type SessionUser = Omit<SelectUser, 'password'>;

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<Omit<SessionUser, 'password'>>(
  sessionStorage
);

// Tell the Authenticator to use the form strategy
authenticator.use(
  new FormStrategy(async ({ form }) => {
    const email = form.get('email');
    const password = form.get('password');
    // You can validate the inputs however you want
    invariant(typeof email === 'string', 'email must be a string');
    invariant(email.length > 0, 'email must not be empty');

    invariant(typeof password === 'string', 'password must be a string');
    invariant(password.length > 0, 'password must not be empty');

    const user = await (
      await db.select().from(usersTable).where(eq(usersTable.email, email))
    )[0];
    if (!user) {
      throw new AuthorizationError('Invalid email or password');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new AuthorizationError('Invalid email or password');
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: hashedPassword, ...rest } = user;
    // the type of this user must match the type you pass to the Authenticator
    // the strategy will automatically inherit the type if you instantiate
    // directly inside the `use` method
    return rest;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  'user-pass'
);

export async function requireSession(request: Request): Promise<SessionUser> {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: loginRoute,
  });

  return user;
}

export async function authorize(
  request: Request
): Promise<{ user: Omit<SelectUser, 'password'> }> {
  const sessionUser = await requireSession(request);

  const user = await getUserById(sessionUser.id);

  // user is required at all times
  if (!user) {
    const session = await sessionStorage.getSession(
      request.headers.get('Cookie')
    );

    throw redirect(loginRoute, {
      headers: {
        'Set-Cookie': await sessionStorage.destroySession(session),
      },
    });
  }
  return { user };
}

export async function logout(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );

  throw redirect(loginRoute, {
    headers: {
      'Set-Cookie': await sessionStorage.destroySession(session),
    },
  });
}
