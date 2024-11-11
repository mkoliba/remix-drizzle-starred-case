import type { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node';
import { Form, json, useActionData, useNavigation } from '@remix-run/react';
import {
  commitSession,
  getSession,
  sessionStorage,
} from '~/lib/session.server';
import { authenticator } from '~/lib/auth.server';
import { redirect } from '@remix-run/node';
import { AuthorizationError } from 'remix-auth';

export async function action({ request }: ActionFunctionArgs) {
  try {
    const user = await authenticator.authenticate('user-pass', request, {
      throwOnError: true,
    });

    // manually get the session
    const session = await getSession(request.headers.get('cookie'));
    // and store the user data
    session.set(authenticator.sessionKey, user);
    // commit the session
    const headers = new Headers({ 'Set-Cookie': await commitSession(session) });

    return redirect('/search', { headers });
  } catch (error) {
    if (
      error instanceof AuthorizationError &&
      error.message === 'Invalid email or password'
    ) {
      return json({ error: 'Invalid email or password' }, { status: 400 });
    }
    console.error(error);
    return json({ error: 'Something went wrong' }, { status: 500 });
  }
}

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.isAuthenticated(request, {
    successRedirect: '/',
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const session = await sessionStorage.getSession(
    request.headers.get('Cookie')
  );
  return {};
}

export default function Login() {
  const actionData = useActionData<typeof action>();
  const transition = useNavigation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <Form method="post" className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue="john@example.com"
                required
                className=" bg-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                defaultValue="password"
                autoComplete="current-password"
                required
                className=" bg-slate-200 appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={transition.state === 'submitting'}
            >
              {transition.state === 'submitting' ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </Form>
        {actionData?.error && (
          <div className="text-red-500 text-center mt-2">
            {actionData.error}
          </div>
        )}
      </div>
    </div>
  );
}
