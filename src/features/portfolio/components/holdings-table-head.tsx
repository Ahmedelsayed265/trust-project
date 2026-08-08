'use client';

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
          {sortable('asset', 'Asset', 'left')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">Quantity</th>
        <th className="px-4 py-2.5 text-right font-medium">Avg entry</th>
        <th className="px-4 py-2.5 text-right font-medium">Mark</th>
        <th className="px-4 py-2.5 font-medium">
          {sortable('allocation', 'Allocation', 'left')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">
          {sortable('value', 'Value', 'right')}
        </th>
        <th className="px-4 py-2.5 text-right font-medium">
          {sortable('pnl', 'Unrealized P&L', 'right')}
        </th>
        <th className="px-4 py-2.5 font-medium">Trend</th>
        <th className="px-4 py-2.5 font-medium">
          <span className="sr-only">Actions</span>
        </th>
      </tr>
    </thead>
  );
}
