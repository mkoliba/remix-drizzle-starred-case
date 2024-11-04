import { Card, CardHeader, CardTitle, CardContent } from '~/components/ui/card';
import { JobPosting } from './types';
import { useFetcher } from '@remix-run/react';

export function JobCard(
  prop: JobPosting & {
    favorite: boolean;
  }
) {
  const fetcher = useFetcher();
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{prop.job_title}</CardTitle>
        <fetcher.Form method="post" action="/favorite">
          <input type="hidden" name="jobId" value={prop.id} />
          <input
            type="hidden"
            name="favorite"
            value={(!prop.favorite).toString()}
          />
          <button
            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label={
              prop.favorite ? 'Remove from favorites' : 'Add to favorites'
            }
          >
            {prop.favorite ? '⭐' : '☆'}
          </button>
        </fetcher.Form>
      </CardHeader>
      <CardContent>
        <p>{prop.description}</p>
      </CardContent>
    </Card>
  );
}
