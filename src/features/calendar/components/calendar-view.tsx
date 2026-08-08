'use client';

import { useTranslations } from 'next-intl';
import { PageHeader } from '@/shared/components/page-header';
import { CalendarEvents } from '@/features/calendar/components/calendar-events';
import { CalendarFilters } from '@/features/calendar/components/calendar-filters';
import { CalendarGrid } from '@/features/calendar/components/calendar-grid';
import { useCalendarMonth } from '@/features/calendar/hooks/use-calendar-month';
import type {
  CalendarEvent,
  CalendarMonthData,
} from '@/features/calendar/types';

export function CalendarView({
  initialData,
  initialUpcoming,
}: {
  initialData: CalendarMonthData;
  initialUpcoming: CalendarEvent[];
}) {
  const t = useTranslations('Calendar');
  const {
    data,
    impact,
    setImpact,
    category,
    setCategory,
    selectedDay,
    setSelectedDay,
    goPrevMonth,
    goNextMonth,
    events,
  } = useCalendarMonth(initialData, initialUpcoming);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader title={t('title')} description={t('description')} />

      <CalendarFilters
        impact={impact}
        category={category}
        onImpactChange={setImpact}
        onCategoryChange={setCategory}
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <CalendarGrid
          monthLabel={data.month_label}
          daysInMonth={data.days_in_month}
          startsOn={data.starts_on}
          highlightedDays={data.highlighted_days}
          selectedDay={selectedDay}
          onSelectDay={setSelectedDay}
          onPrevMonth={goPrevMonth}
          onNextMonth={goNextMonth}
        />

        <CalendarEvents
          events={events}
          selectedDay={selectedDay}
          monthLabel={data.month_label}
        />
      </div>
    </div>
  );
}
