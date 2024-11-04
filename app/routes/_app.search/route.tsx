import { LoaderFunctionArgs, json } from '@remix-run/node';
import { Input } from '~/components/ui/input';
import { Button } from '~/components/ui/button';
import { Search } from 'lucide-react';
import { Form, useLoaderData, useSearchParams } from '@remix-run/react';
import { authorize } from '~/lib/auth.server';
import { zx } from 'zodix';
import { z } from 'zod';
import { SearchPagination } from './Pagination';
import { JobListingResponse, JobSearchPayload, JobPosting } from './types';
import { JobCard } from './JobCard';
import db from '~/db.server';
import { favoriteJobsTable } from '~/db/schema.server';
import { eq } from 'drizzle-orm';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { user } = await authorize(request);

  const { page, search } = zx.parseQuery(request, {
    page: zx.NumAsString.optional(),
    search: z.string().optional(),
  });

  const favoriteJobsIds = (
    await db
      .select({
        id: favoriteJobsTable.jobId,
      })
      .from(favoriteJobsTable)
      .where(eq(favoriteJobsTable.userId, user.id))
  ).map(({ id }) => id);

  if (search == null || search === '') {
    const url = new URL(
      'https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs'
    );
    // if page is not 0, add it to the url
    if (page && page !== 0) {
      url.searchParams.set('page', page.toString());
    }

    const result = (await fetch(url).then((res) =>
      res.json()
    )) as JobListingResponse;
    return json({ searchResult: result, favoriteJobsIds });
  }

  const titleSearch = (await fetch(
    'https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/recommendations',
    {
      method: 'POST',
      body: JSON.stringify({ jobTitle: search }),
    }
  ).then((res) => res.json())) as JobSearchPayload;

  const jobIds = titleSearch.jobIds ?? [];
  const data = (await Promise.all(
    jobIds.map((id) =>
      fetch(
        `https://yon9jygrt9.execute-api.eu-west-1.amazonaws.com/prod/jobs/${id}`
      ).then((res) => res.json())
    )
  )) as JobPosting[];

  const searchResult: JobListingResponse = { data };
  return json({ searchResult, favoriteJobsIds });
};

export default function Route() {
  const { searchResult, favoriteJobsIds } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const search = searchParams.get('search');

  return (
    <main>
      <div className="max-w-7xl  py-4 sm:px-6 lg:px-8 flex flex-col gap-4 items-center">
        {/* Search bar */}
        <div className="w-full max-w-2xl px-4 sm:px-0">
          <Form className="flex items-center gap-2">
            <Input
              type="search"
              minLength={2}
              name="search"
              placeholder="Search..."
              defaultValue={search ?? ''}
              className="w-full"
            />
            <Button type="submit" variant="outline" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          </Form>
        </div>

        {/* Search results */}
        <div className="space-y-4">
          {searchResult.data.map((result) => (
            <JobCard
              key={result.id}
              {...result}
              favorite={favoriteJobsIds.includes(result.id)}
            />
          ))}
          {searchResult.data.length === 0 ? <p>No results found</p> : null}
        </div>

        {/* Replace pagination section with new component */}
        {searchResult?.pagination && (
          <SearchPagination pagination={searchResult.pagination} />
        )}
      </div>
    </main>
  );
}
