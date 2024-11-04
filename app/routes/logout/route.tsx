import { type LoaderFunctionArgs } from '@remix-run/node';
import { logout } from '~/lib/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  return await logout(request);
};
