'use client';

import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

const categories = [
  'All',
  'Crypto',
  'Stocks',
  'Metals',
  'US',
  'Europe',
  'MENA',
  'India',
  'Asia',
] as const;

export function MarketCategoryTabs({
  value = 'All',
  onChange,
  search,
  onSearchChange,
  searchOpen,
  onSearchOpenChange,
}: {
  value?: string;
  onChange?: (category: string) => void;
  search?: string;
  onSearchChange?: (value: string) => void;
  searchOpen?: boolean;
  onSearchOpenChange?: (open: boolean) => void;
}) {
  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 scrollbar-none items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange?.(category)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              value === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground ring-border hover:bg-muted hover:text-foreground ring-1',
            )}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {searchOpen ? (
          <div className="relative w-full sm:w-56">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              value={search ?? ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Search markets…"
              className="bg-card h-9 rounded-xl pr-9 pl-8 text-sm"
              aria-label="Search markets"
            />
            <button
              type="button"
              onClick={() => {
                onSearchChange?.('');
                onSearchOpenChange?.(false);
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-0.5"
              aria-label="Close search"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onSearchOpenChange?.(true)}
            className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-xl border p-2 transition-colors"
            aria-label="Search markets"
          >
            <Search className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
