import { Form } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Pagination } from './types';

// Add new PaginationProps type and component
type PaginationProps = {
  pagination: Pagination;
};

export function SearchPagination({ pagination }: PaginationProps) {
  return (
    <div className="flex justify-center gap-2">
      <Form method="get">
        <input type="hidden" name="page" value={pagination.currentPage - 1} />
        <Button
          variant="outline"
          type="submit"
          disabled={pagination.currentPage === pagination.firstPage}
        >
          Previous
        </Button>
      </Form>
      <Form method="get">
        <input type="hidden" name="page" value={pagination.currentPage + 1} />
        <Button
          variant="outline"
          type="submit"
          disabled={pagination.currentPage === pagination.lastPage}
        >
          Next
        </Button>
      </Form>
    </div>
  );
}
