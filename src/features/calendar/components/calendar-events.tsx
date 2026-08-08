'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { impactBadgeClass } from '@/features/calendar/lib/calendar-display';
import type { CalendarEvent } from '@/features/calendar/types';
import { cn } from '@/lib/utils';

type CalendarEventsProps = {
  events: CalendarEvent[];
  selectedDay: number | null;
  monthLabel: string;
};

export function CalendarEvents({
  events,
  selectedDay,
  monthLabel,
}: CalendarEventsProps) {
  const t = useTranslations('Calendar');

  function impactLabel(impact: string) {
    if (impact === 'high') return t('high');
    if (impact === 'medium') return t('medium');
    if (impact === 'low') return t('low');
    return impact;
  }

  function categoryLabel(category: string) {
    if (category === 'economic') return t('economic');
    if (category === 'earnings') return t('earnings');
    if (category === 'crypto') return t('crypto');
    if (category === 'dividend') return t('dividend');
    if (category === 'ipo') return t('ipo');
    return category;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDay != null
            ? t('eventsDay', {
                month: monthLabel.split(' ')[0],
                day: selectedDay,
              })
            : t('upcomingEvents')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {selectedDay != null ? t('noEventsDay') : t('noUpcoming')}
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="border-border space-y-2 rounded-xl border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-semibold">
                    {event.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {event.date} · {event.time_label}
                    {event.country ? ` · ${event.country}` : null}
                    {event.symbol ? ` · ${event.symbol}` : null}
                  </p>
                </div>
                <Badge
                  className={cn(
                    'shrink-0 border-0',
                    impactBadgeClass(event.impact),
                  )}
                >
                  {impactLabel(event.impact)}
                </Badge>
              </div>
              {event.description ? (
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {event.description}
                </p>
              ) : null}
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="secondary" className="border-0 capitalize">
                  {categoryLabel(event.category)}
                </Badge>
                {event.forecast ? (
                  <Badge variant="outline" className="font-normal">
                    {t('forecastShort', { value: event.forecast })}
                  </Badge>
                ) : null}
                {event.previous ? (
                  <Badge variant="outline" className="font-normal">
                    {t('previousShort', { value: event.previous })}
                  </Badge>
                ) : null}
                {event.actual ? (
                  <Badge variant="outline" className="font-normal">
                    {t('actualShort', { value: event.actual })}
                  </Badge>
                ) : null}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
