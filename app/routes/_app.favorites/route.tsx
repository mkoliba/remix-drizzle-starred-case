import type { LoaderFunctionArgs } from '@remix-run/node';
import { eq } from 'drizzle-orm';
import db from '~/db.server';
import { favoriteJobsTable } from '~/db/schema.server';
import { authorize } from '~/lib/auth.server';
import { JobListingResponse, JobPosting } from '../_app.search/types';
import { useLoaderData } from '@remix-run/react';
import { JobCard } from '../_app.search/JobCard';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await authorize(request);

  const favoriteJobsIds = (
    await db
      .select({
        id: favoriteJobsTable.jobId,
      })
      .from(favoriteJobsTable)
      .where(eq(favoriteJobsTable.userId, user.id))
  ).map(({ id }) => id);

  if (favoriteJobsIds.length === 0) {
    return { searchResult: { data: [] } };
  }

  const data = (await Promise.all(
    favoriteJobsIds.map((id) =>
      fetch(
        `https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/${id}`
      ).then((res) => res.json())
    )
  )) as JobPosting[];

  const searchResult: JobListingResponse = { data };
  return { searchResult };
};

export default function Route() {
  const { searchResult } = useLoaderData<typeof loader>();
  return (
    <main>
      <div className="max-w-7xl  py-4 sm:px-6 lg:px-8 flex flex-col gap-4 items-center">
        {/* Search results */}
        <div className="space-y-4">
          {searchResult.data.map((result) => (
            <JobCard key={result.id} {...result} favorite={true} />
          ))}
        </div>
      </div>
    </main>
  );
}
