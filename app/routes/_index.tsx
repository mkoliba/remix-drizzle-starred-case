import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { authorize } from '~/lib/auth.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await authorize(request);

  return redirect('/search');
};
