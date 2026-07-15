import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { cn } from "@/lib/utils";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const dates = Array.from({ length: 28 }, (_, i) => i + 1);

const events = [
  {
    day: 14,
    title: "US CPI Release",
    time: "15:30 UTC",
    impact: "High",
  },
  {
    day: 16,
    title: "FOMC Minutes",
    time: "19:00 UTC",
    impact: "High",
  },
  {
    day: 18,
    title: "Ethereum Upgrade Window",
    time: "All day",
    impact: "Medium",
  },
  {
    day: 21,
    title: "Earnings: NVDA",
    time: "After close",
    impact: "High",
  },
];

export function CalendarView() {
  const highlighted = new Set(events.map((e) => e.day));

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Calendar"
        description="Economic events and market catalysts."
      />

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="">
          <CardHeader>
            <CardTitle>July 2026</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
              {days.map((day) => (
                <div key={day} className="py-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {dates.map((date) => (
                <div
                  key={date}
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-xl text-sm font-medium",
                    highlighted.has(date)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted/40 text-foreground hover:bg-muted"
                  )}
                >
                  {date}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {events.map((event) => (
              <div
                key={event.title}
                className="rounded-xl border border-border p-3"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {event.title}
                  </p>
                  <Badge
                    className={cn(
                      "border-0",
                      event.impact === "High"
                        ? "bg-red-50 text-destructive hover:bg-red-50 dark:bg-red-950/40"
                        : "bg-amber-50 text-amber-600 hover:bg-amber-50 dark:bg-amber-950/40"
                    )}
                  >
                    {event.impact}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Jul {event.day} · {event.time}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
