'use client';

import { useTranslations } from 'next-intl';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { MarketCategory } from '@/features/markets/types';
import { cn } from '@/lib/utils';

type MarketCategoryTabsProps = {
  categories: MarketCategory[];
  value: string;
  onChange: (value: string) => void;
  searchDraft: string;
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: (event?: React.FormEvent) => void;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
};

export function MarketCategoryTabs({
  categories,
  value,
  onChange,
  searchDraft,
  onSearchDraftChange,
  onSearchSubmit,
  searchOpen,
  onSearchOpenChange,
}: MarketCategoryTabsProps) {
  const t = useTranslations('Markets');

  function categoryLabel(category: MarketCategory) {
    const key = category.key as
      'all' | 'crypto' | 'stocks' | 'metals' | 'forex' | 'indices';
    if (
      key === 'all' ||
      key === 'crypto' ||
      key === 'stocks' ||
      key === 'metals' ||
      key === 'forex' ||
      key === 'indices'
    ) {
      return t(`assetClass.${key}`);
    }
    return category.label;
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 scrollbar-none items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => onChange(category.key)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              value === category.key
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground ring-border hover:bg-muted hover:text-foreground ring-1',
            )}
          >
            {categoryLabel(category)}
            <span
              className={cn(
                'ml-1.5 text-xs',
                value === category.key
                  ? 'text-primary-foreground/80'
                  : 'text-muted-foreground',
              )}
            >
              {category.count}
            </span>
          </button>
        ))}
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {searchOpen ? (
          <form onSubmit={onSearchSubmit} className="relative w-full sm:w-56">
            <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2" />
            <Input
              autoFocus
              value={searchDraft}
              onChange={(event) => onSearchDraftChange(event.target.value)}
              placeholder={t('searchPlaceholder')}
              className="bg-card h-9 rounded-xl pr-9 pl-8 text-sm"
              aria-label={t('searchAria')}
            />
            <button
              type="button"
              onClick={() => {
                onSearchDraftChange('');
                onSearchOpenChange(false);
                onSearchSubmit();
              }}
              className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded-md p-0.5"
              aria-label={t('closeSearch')}
            >
              <X className="size-4" />
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => onSearchOpenChange(true)}
            className="border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground shrink-0 rounded-xl border p-2 transition-colors"
            aria-label={t('searchAria')}
          >
            <Search className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
