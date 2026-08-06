import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

type CalendarGridProps = {
  monthLabel: string;
  daysInMonth: number;
  startsOn: number;
  highlightedDays: number[];
  selectedDay: number | null;
  onSelectDay: (day: number | null) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
};

export function CalendarGrid({
  monthLabel,
  daysInMonth,
  startsOn,
  highlightedDays,
  selectedDay,
  onSelectDay,
  onPrevMonth,
  onNextMonth,
}: CalendarGridProps) {
  const highlighted = new Set(highlightedDays);
  const blanks = Array.from({ length: Math.max(0, startsOn) }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3 space-y-0">
        <CardTitle>{monthLabel}</CardTitle>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={onPrevMonth}
          >
            Prev
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={onNextMonth}
          >
            Next
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium">
          {WEEKDAYS.map((day) => (
            <div key={day} className="py-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blanks.map((blank) => (
            <div key={`blank-${blank}`} className="aspect-square" />
          ))}
          {days.map((day) => {
            const hasEvents = highlighted.has(day);
            const selected = selectedDay === day;
            return (
              <button
                key={day}
                type="button"
                onClick={() => onSelectDay(selected ? null : day)}
                className={cn(
                  'flex aspect-square items-center justify-center rounded-xl text-sm font-medium transition-colors',
                  selected
                    ? 'bg-primary text-primary-foreground ring-primary/40 ring-2'
                    : hasEvents
                      ? 'bg-primary/15 text-foreground hover:bg-primary/25'
                      : 'bg-muted/40 text-foreground hover:bg-muted',
                )}
              >
                {day}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
