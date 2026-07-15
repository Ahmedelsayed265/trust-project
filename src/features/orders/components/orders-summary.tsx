import {
  CheckCircle2,
  Clock3,
  FileText,
  PieChart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    label: "Open Orders",
    value: "4",
    icon: FileText,
    iconClass:
      "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
  },
  {
    label: "Pending",
    value: "2",
    icon: Clock3,
    iconClass:
      "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
  },
  {
    label: "Partially Filled",
    value: "1",
    icon: PieChart,
    iconClass: "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300",
  },
  {
    label: "Filled Today",
    value: "6",
    icon: CheckCircle2,
    iconClass:
      "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
];

export function OrdersSummary({
  openCount,
  pendingCount,
  partialCount,
}: {
  openCount: number;
  pendingCount: number;
  partialCount: number;
}) {
  const values = [String(openCount), String(pendingCount), String(partialCount), "6"];

  return (
    <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.label} className="" size="sm">
            <CardContent className="flex items-center gap-3">
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  stat.iconClass
                )}
              >
                <Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <p className="text-xl font-bold text-foreground">
                  {values[index]}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
