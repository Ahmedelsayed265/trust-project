import { getTranslations } from 'next-intl/server';
import {
  getCalendarAction,
  getCalendarUpcomingAction,
} from '@/features/calendar/actions/get-calendar';
import { currentMonthKey } from '@/features/calendar/lib/calendar-display';
import { CalendarView } from '@/features/calendar';

export default async function CalendarPage() {
  const t = await getTranslations('ErrorsPageLoad');
  const [calendarResult, upcomingResult] = await Promise.all([
    getCalendarAction({ month: currentMonthKey() }),
    getCalendarUpcomingAction({ limit: 5 }),
  ]);

  if (!calendarResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('calendar')}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {calendarResult.message}
        </p>
      </div>
    );
  }

  return (
    <CalendarView
      initialData={calendarResult.data}
      initialUpcoming={upcomingResult.ok ? upcomingResult.data : []}
    />
  );
}
