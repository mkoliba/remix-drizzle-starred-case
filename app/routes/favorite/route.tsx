import { ActionFunctionArgs } from '@remix-run/node';
import { zx } from 'zodix';
import db from '~/db.server';
import { favoriteJobsTable } from '~/db/schema.server';
import { authorize } from '~/lib/auth.server';
import { and, eq } from 'drizzle-orm';

export const action = async ({ request }: ActionFunctionArgs) => {
  const { user } = await authorize(request);
  const { jobId, favorite } = await zx.parseForm(request, {
    jobId: zx.IntAsString,
    favorite: zx.BoolAsString,
  });

  if (favorite === true) {
    await db
      .insert(favoriteJobsTable)
      .values({
        jobId,
        userId: user.id,
      })
      .onConflictDoNothing();
    return new Response(null, { status: 200 });
  }

  await db
    .delete(favoriteJobsTable)
    .where(
      and(
        eq(favoriteJobsTable.jobId, jobId),
        eq(favoriteJobsTable.userId, user.id)
      )
    );
  return new Response(null, { status: 200 });
};
