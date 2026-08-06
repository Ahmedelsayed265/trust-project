import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  categoryLabel,
  impactBadgeClass,
  impactLabel,
} from '@/features/calendar/lib/calendar-display';
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {selectedDay != null
            ? `Events · ${monthLabel.split(' ')[0]} ${selectedDay}`
            : 'Upcoming Events'}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {events.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {selectedDay != null
              ? 'No events for this day.'
              : 'No upcoming events.'}
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
                    F: {event.forecast}
                  </Badge>
                ) : null}
                {event.previous ? (
                  <Badge variant="outline" className="font-normal">
                    P: {event.previous}
                  </Badge>
                ) : null}
                {event.actual ? (
                  <Badge variant="outline" className="font-normal">
                    A: {event.actual}
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
