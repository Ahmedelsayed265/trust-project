"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  type PortfolioSnapshot,
} from "@/shared/trading";
import { EquityChart } from "@/features/portfolio/components/equity-chart";
import {
  buildEquityCurve,
  PERFORMANCE_RANGES,
  type PerformanceRangeId,
} from "@/features/portfolio/lib/portfolio-data";

export function PortfolioPerformance({
  snapshot,
  loading,
}: {
  snapshot: PortfolioSnapshot | null;
  loading: boolean;
}) {
  const [rangeId, setRangeId] = useState<PerformanceRangeId>("1M");
  const range =
    PERFORMANCE_RANGES.find((item) => item.id === rangeId) ?? PERFORMANCE_RANGES[1];
  const currency = snapshot?.currency ?? "USD";

  const curve = useMemo(() => {
    if (!snapshot) return null;
    return buildEquityCurve({
      equity: snapshot.equity,
      dayPnlPct: snapshot.dayPnlPct,
      range,
      seed: snapshot.providerId,
    });
  }, [snapshot, range]);

  const positive = (curve?.changeValue ?? 0) >= 0;

  const formatDate = (timestamp: number) =>
    new Intl.DateTimeFormat("en-US",
      range.id === "1Y"
        ? { month: "short", year: "2-digit" }
        : { month: "short", day: "numeric" }
    ).format(new Date(timestamp));

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>Performance</CardTitle>
          {loading ? (
            <Skeleton className="mt-2 h-7 w-36" />
          ) : (
            <>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {snapshot ? formatMoney(snapshot.equity, currency) : "—"}
              </p>
              {curve && (
                <p
                  className={cn(
                    "text-xs font-semibold",
                    positive ? "text-success" : "text-destructive"
                  )}
                >
                  {formatSignedMoney(curve.changeValue, currency)} (
                  {formatPct(curve.changePct)}){" "}
                  <span className="text-muted-foreground">past {range.id}</span>
                </p>
              )}
            </>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 rounded-lg bg-muted p-0.5">
          {PERFORMANCE_RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setRangeId(item.id)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                item.id === rangeId
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.id}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {loading || !curve ? (
          <Skeleton className="h-55 w-full" />
        ) : (
          <EquityChart
            points={curve.points}
            positive={positive}
            formatValue={(value) => formatMoney(value, currency)}
            formatDate={formatDate}
          />
        )}
      </CardContent>
    </Card>
  );
}
