'use client';

import { cn } from '@/lib/utils';
import {
  HOLDINGS_FILTERS,
  type HoldingsFilter,
} from '@/features/portfolio/hooks/use-holdings-table';

export function HoldingsFilterTabs({
  value,
  onChange,
}: {
  value: HoldingsFilter;
  onChange: (filter: HoldingsFilter) => void;
}) {
  return (
    <div className="bg-muted flex shrink-0 items-center gap-0.5 rounded-lg p-0.5">
      {HOLDINGS_FILTERS.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onChange(item.id)}
          className={cn(
            'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
            item.id === value
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
