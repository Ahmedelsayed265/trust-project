'use client';

import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type NewsFiltersProps = {
  tag: string;
  tags: string[];
  searchDraft: string;
  onTagChange: (tag: string) => void;
  onSearchDraftChange: (value: string) => void;
  onSearchSubmit: (event: React.FormEvent) => void;
};

export function NewsFilters({
  tag,
  tags,
  searchDraft,
  onTagChange,
  onSearchDraftChange,
  onSearchSubmit,
}: NewsFiltersProps) {
  const t = useTranslations('News');
  const tCommon = useTranslations('Common');
  const tabs = ['all', ...tags];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 flex-wrap gap-2">
        {tabs.map((item) => {
          const active = tag === item;
          return (
            <button
              key={item}
              type="button"
              onClick={() => onTagChange(item)}
              className={cn(
                'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {item === 'all' ? tCommon('all') : item}
            </button>
          );
        })}
      </div>

      <form
        onSubmit={onSearchSubmit}
        className="flex w-full max-w-xs items-center gap-2"
      >
        <Input
          value={searchDraft}
          onChange={(event) => onSearchDraftChange(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="h-10 rounded-md"
          aria-label={t('searchAria')}
        />
        <Button
          type="submit"
          variant="outline"
          size="icon"
          className="size-10 shrink-0 rounded-md"
          aria-label={t('searchButtonAria')}
        >
          <Search className="size-4" />
        </Button>
      </form>
    </div>
  );
}
