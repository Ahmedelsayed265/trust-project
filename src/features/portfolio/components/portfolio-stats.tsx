"use client";

import { Banknote, Layers, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  type PortfolioSnapshot,
} from "@/shared/trading";
import type { Holding } from "@/features/portfolio/lib/portfolio-data";

export function PortfolioStats({
  snapshot,
  holdings,
  loading,
}: {
  snapshot: PortfolioSnapshot | null;
  holdings: Holding[];
  loading: boolean;
}) {
  const currency = snapshot?.currency ?? "USD";
  const positions = holdings.filter((holding) => holding.kind === "position");
  const invested = positions.reduce((sum, holding) => sum + holding.value, 0);
  const openPnl = snapshot?.openPnl ?? 0;
  const costBasis = invested - openPnl;
  const openPnlPct = costBasis > 0 ? (openPnl / costBasis) * 100 : 0;
  const dayPnl = snapshot?.dayPnl ?? 0;
  const dayPositive = dayPnl >= 0;
  const pnlPositive = openPnl >= 0;

  const stats = [
    {
      label: "Provider equity",
      icon: Wallet,
      value: formatMoney(snapshot?.equity ?? 0, currency),
      hint: (
        <span className={dayPositive ? "text-success" : "text-destructive"}>
          {formatSignedMoney(dayPnl, currency)} ({formatPct(snapshot?.dayPnlPct ?? 0)}){" "}
          <span className="text-muted-foreground">today</span>
        </span>
      ),
    },
    {
      label: "Positions value",
      icon: Layers,
      value: formatMoney(invested, currency),
      hint: (
        <span className="text-muted-foreground">
          {positions.length} open {positions.length === 1 ? "position" : "positions"}
        </span>
      ),
    },
    {
      label: "Unrealized P&L",
      icon: pnlPositive ? TrendingUp : TrendingDown,
      value: formatSignedMoney(openPnl, currency),
      valueClassName: pnlPositive ? "text-success" : "text-destructive",
      hint: (
        <span className={pnlPositive ? "text-success" : "text-destructive"}>
          {formatPct(openPnlPct)} <span className="text-muted-foreground">on cost</span>
        </span>
      ),
    },
    {
      label: "Buying power",
      icon: Banknote,
      value: formatMoney(snapshot?.buyingPower ?? 0, currency),
      hint: <span className="text-muted-foreground">Free cash at provider</span>,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} size="sm">
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-medium text-muted-foreground">
                {stat.label}
              </p>
              <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <stat.icon className="size-3.5" />
              </span>
            </div>

            {loading ? (
              <>
                <Skeleton className="h-7 w-28" />
                <Skeleton className="h-3.5 w-32" />
              </>
            ) : (
              <>
                <p
                  className={cn(
                    "text-xl font-bold tracking-tight text-foreground",
                    stat.valueClassName
                  )}
                >
                  {snapshot ? stat.value : "—"}
                </p>
                <p className="text-xs font-medium">
                  {snapshot ? (
                    stat.hint
                  ) : (
                    <span className="text-muted-foreground">No provider data</span>
                  )}
                </p>
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
