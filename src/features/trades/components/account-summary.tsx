import { TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeIndicator } from "@/shared/components/change-indicator";

const metrics = [
  { label: "Buying Power", value: "$8,642.21" },
  { label: "Open P&L", value: "+$320.45", positive: true },
  { label: "Day P&L", value: "+$320.45", positive: true },
];

export function AccountSummary() {
  return (
    <Card className="shadow-sm">
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Account Equity</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              $24,530.45
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-success">
              <TrendingUp className="size-4" />
              <span>+$1,250.34 (5.37%)</span>
              <span className="font-normal text-muted-foreground">Today</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-[120px]">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {metric.label}
                </p>
                {metric.positive ? (
                  <ChangeIndicator
                    value={metric.value}
                    className="mt-1 text-base font-bold sm:text-lg"
                  />
                ) : (
                  <p className="mt-1 text-base font-bold text-foreground sm:text-lg">
                    {metric.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full w-[68%] rounded-full bg-primary" />
        </div>
      </CardContent>
    </Card>
  );
}
