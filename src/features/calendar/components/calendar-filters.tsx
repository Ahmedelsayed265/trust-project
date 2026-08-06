import { cn } from '@/lib/utils';
import type {
  CalendarCategory,
  CalendarImpact,
} from '@/features/calendar/types';

const IMPACT_FILTERS: { id: 'all' | CalendarImpact; label: string }[] = [
  { id: 'all', label: 'All impact' },
  { id: 'high', label: 'High' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

const CATEGORY_FILTERS: { id: 'all' | CalendarCategory; label: string }[] = [
  { id: 'all', label: 'All types' },
  { id: 'economic', label: 'Economic' },
  { id: 'earnings', label: 'Earnings' },
  { id: 'crypto', label: 'Crypto' },
  { id: 'dividend', label: 'Dividend' },
  { id: 'ipo', label: 'IPO' },
];

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
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
      <div className="flex flex-wrap gap-2">
        {IMPACT_FILTERS.map((filter) => (
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
        {CATEGORY_FILTERS.map((filter) => (
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
