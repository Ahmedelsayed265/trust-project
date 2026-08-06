import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { SignalsPagination } from '@/features/ai-signals/types';

type SignalsPaginationProps = {
  pagination: SignalsPagination;
  onPageChange: (page: number) => void;
};

export function SignalsPaginationBar({
  pagination,
  onPageChange,
}: SignalsPaginationProps) {
  if (pagination.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-muted-foreground text-sm">
        Page {pagination.current_page} of {pagination.last_page}
        {pagination.total > 0 ? ` · ${pagination.total} total` : null}
      </p>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={!pagination.prev_page_url}
          onClick={() => onPageChange(Math.max(1, pagination.current_page - 1))}
        >
          <ChevronLeft className="size-4" />
          Prev
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={!pagination.next_page_url}
          onClick={() => onPageChange(pagination.current_page + 1)}
        >
          Next
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
