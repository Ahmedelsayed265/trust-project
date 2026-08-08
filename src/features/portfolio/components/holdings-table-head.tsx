'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { HoldingsSortKey } from '@/features/portfolio/hooks/use-holdings-table';

export function HoldingsTableHead({
  sortKey,
  onSort,
}: {
  sortKey: HoldingsSortKey;
  onSort: (key: HoldingsSortKey) => void;
}) {
  const t = useTranslations('Portfolio');
  const tCommon = useTranslations('Common');

  const sortable = (
    key: HoldingsSortKey,
    label: string,
    align: 'left' | 'right',
  ) => (
    <button
      type="button"
      onClick={() => onSort(key)}
      className={cn(
        'hover:text-foreground inline-flex items-center gap-1 transition-colors',
        sortKey === key && 'text-foreground',
        align === 'right' && 'flex-row-reverse',
      )}
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  );

  return (
    <thead>
      <tr className="border-border text-muted-foreground border-b text-xs font-medium">
        <th className="px-4 py-2.5 font-medium">
          {sortable('asset', t('colAsset'), 'left')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">
          {t('colQuantity')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">
          {t('colAvgEntry')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">{t('colMark')}</th>
        <th className="px-4 py-2.5 font-medium">
          {sortable('allocation', t('colAllocation'), 'left')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">
          {sortable('value', t('colValue'), 'right')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">
          {sortable('pnl', t('unrealizedPnl'), 'right')}
        </th>
        <th className="px-4 py-2.5 font-medium">{t('colTrend')}</th>
        <th className="px-4 py-2.5 font-medium">
          <span className="sr-only">{tCommon('actions')}</span>
        </th>
      </tr>
    </thead>
  );
}
