'use client';

import { useTranslations } from 'next-intl';
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
  const t = useTranslations('AiSignals');
  const tCommon = useTranslations('Common');

  if (pagination.last_page <= 1) return null;

  return (
    <div className="flex items-center justify-between gap-3">
      <p className="text-muted-foreground text-sm">
        {t('pageOf', {
          current: pagination.current_page,
          last: pagination.last_page,
        })}
        {pagination.total > 0
          ? ` ${t('totalSuffix', { total: pagination.total })}`
          : null}
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
          {t('prev')}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="rounded-xl"
          disabled={!pagination.next_page_url}
          onClick={() => onPageChange(pagination.current_page + 1)}
        >
          {tCommon('next')}
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
