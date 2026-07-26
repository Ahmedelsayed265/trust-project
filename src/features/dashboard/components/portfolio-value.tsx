"use client";

import Link from "next/link";
import { Eye, Link2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/shared/components/sparkline";
import { routes } from "@/shared/lib/routes";
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  useTrading,
} from "@/shared/trading";

const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"] as const;

const chartByTimeframe: Record<(typeof timeframes)[number], number[]> = {
  "1D": [42, 45, 43, 48, 52, 50, 55, 58, 54, 60, 63, 68, 65, 72, 78],
  "1W": [38, 41, 44, 42, 48, 51, 49, 55, 58, 61, 59, 64, 70, 73, 78],
  "1M": [30, 34, 32, 38, 42, 40, 46, 50, 48, 55, 58, 62, 66, 71, 78],
  "3M": [22, 28, 25, 33, 37, 35, 42, 48, 45, 52, 57, 60, 65, 72, 78],
  "1Y": [18, 24, 30, 28, 36, 42, 40, 48, 52, 50, 58, 64, 68, 74, 78],
  ALL: [12, 18, 22, 28, 26, 34, 40, 38, 46, 52, 55, 62, 68, 74, 78],
};

export function PortfolioValue() {
  const [timeframe, setTimeframe] = useState<(typeof timeframes)[number]>("1D");
  const { snapshot, activeProvider, loading } = useTrading();
  const chartData = chartByTimeframe[timeframe];
  const equity = snapshot?.equity ?? null;
  const dayPnl = snapshot?.dayPnl ?? null;
  const dayPnlPct = snapshot?.dayPnlPct ?? null;
  const currency = snapshot?.currency ?? "USD";

  return (
    <div className="rounded-[12px] border border-border bg-card px-5 py-6 shadow-none sm:px-6 sm:py-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Provider equity</span>
              <Eye className="size-3.5 opacity-70" />
              <span className="rounded-md border border-border px-2 py-0.5 text-[11px] font-semibold">
                {activeProvider.displayName}
              </span>
              <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                Demo
              </span>
            </div>

            <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {loading
                ? "…"
                : equity != null
                  ? formatMoney(equity, currency)
                  : formatMoney(0, currency)}
            </p>

            {dayPnl != null && dayPnlPct != null ? (
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2.5 py-1 text-sm font-semibold text-success dark:bg-emerald-950/40">
                <TrendingUp className="size-3.5" />
                <span>
                  {formatSignedMoney(dayPnl, currency)} ({formatPct(dayPnlPct)})
                </span>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">
                Demo balances from {activeProvider.displayName}.
              </p>
            )}
          </div>

          <div className="flex gap-2.5">
            <Link
              href={routes.accounts}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Link2 className="size-4" />
              Manage accounts
            </Link>
            <Link
              href={routes.trades}
              className="rounded-md border border-primary bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
            >
              Trade
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:max-w-md">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Day P&L
              </p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-success">
                {dayPnl != null ? formatSignedMoney(dayPnl, currency) : "—"}
                {dayPnlPct != null && (
                  <span className="ml-1.5 text-sm font-medium text-success/80">
                    ({formatPct(dayPnlPct)})
                  </span>
                )}
              </p>
            </div>
            <span className="rounded-md border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {timeframe}
            </span>
          </div>

          <div className="relative min-h-30 flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between"
            >
              <div className="border-t border-dashed border-border/80" />
              <div className="border-t border-dashed border-border/80" />
              <div className="border-t border-dashed border-border/80" />
            </div>
            <Sparkline
              data={chartData}
              positive
              fill
              showDot
              className="relative h-full min-h-30 w-full"
              strokeWidth={2.25}
            />
          </div>

          <div
            role="tablist"
            aria-label="Chart timeframe"
            className="mt-4 flex rounded-md border border-border bg-card p-1"
          >
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                role="tab"
                aria-selected={timeframe === tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "flex-1 rounded-[6px] px-2 py-1.5 text-xs font-semibold transition-colors",
                  timeframe === tf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
