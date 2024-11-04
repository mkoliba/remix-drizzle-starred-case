import type { MetaFunction, LoaderFunctionArgs } from '@remix-run/node';
import { NavLink, Outlet, useLoaderData } from '@remix-run/react';
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar';

import { authorize } from '~/lib/auth.server';

export const meta: MetaFunction = () => {
  return [
    { title: 'New Remix App' },
    { name: 'description', content: 'Welcome to Remix!' },
  ];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await authorize(request);

  return { user };
};

export default function Index() {
  const { user } = useLoaderData<typeof loader>();
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header with user menu */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex flex-col items-center space-x-4 gap-4 ">
            <h1 className="text-2xl font-bold text-gray-900">Search App</h1>
            <div className="flex items-center space-x-4">
              <NavLink to="/search">Search</NavLink>
              <NavLink to="/favorites">Favorites</NavLink>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">{user.fullName}</span>
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
