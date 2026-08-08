'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import type {
  CalendarCategory,
  CalendarImpact,
} from '@/features/calendar/types';

type CalendarFiltersProps = {
  impact: 'all' | CalendarImpact;
  category: 'all' | CalendarCategory;
  onImpactChange: (value: 'all' | CalendarImpact) => void;
  onCategoryChange: (value: 'all' | CalendarCategory) => void;
};

export function CalendarFilters({
  impact,
  category,
  onImpactChange,
  onCategoryChange,
}: CalendarFiltersProps) {
  const t = useTranslations('Calendar');

  const impactFilters: { id: 'all' | CalendarImpact; label: string }[] = [
    { id: 'all', label: t('allImpact') },
    { id: 'high', label: t('high') },
    { id: 'medium', label: t('medium') },
    { id: 'low', label: t('low') },
  ];

  const categoryFilters: { id: 'all' | CalendarCategory; label: string }[] = [
    { id: 'all', label: t('allTypes') },
    { id: 'economic', label: t('economic') },
    { id: 'earnings', label: t('earnings') },
    { id: 'crypto', label: t('crypto') },
    { id: 'dividend', label: t('dividend') },
    { id: 'ipo', label: t('ipo') },
  ];

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {impactFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onImpactChange(filter.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              impact === filter.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {categoryFilters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            onClick={() => onCategoryChange(filter.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
              category === filter.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground ring-border hover:text-foreground ring-1',
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
