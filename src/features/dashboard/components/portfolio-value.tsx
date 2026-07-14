"use client";

import { Eye, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Sparkline } from "@/shared/components/sparkline";

const timeframes = ["1D", "1W", "1M", "3M", "1Y", "ALL"] as const;

const portfolioData = [42, 45, 43, 48, 52, 50, 55, 58, 54, 60, 63, 68, 65, 72, 78];

export function PortfolioValue() {
  const [timeframe, setTimeframe] = useState<(typeof timeframes)[number]>("1D");

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
            <span>Total Portfolio Value</span>
            <Eye className="size-3.5" />
          </div>

          <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            $24,530.45
          </p>

          <div className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-success">
            <TrendingUp className="size-4" />
            <span>+$1,250.34 (5.37%)</span>
          </div>

          <div className="mt-5 flex gap-2.5">
            <button
              type="button"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Deposit
            </button>
            <button
              type="button"
              className="rounded-xl border border-primary bg-transparent px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-accent"
            >
              Withdraw
            </button>
          </div>
        </div>

        <div className="min-w-0 flex-1 lg:max-w-sm">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Today&apos;s P&L</span>
            <span className="text-sm font-semibold text-success">
              +$320.45 (1.32%)
            </span>
          </div>

          <div className="h-24 w-full">
            <Sparkline
              data={portfolioData}
              positive
              fill
              className="h-full w-full"
              strokeWidth={2.5}
            />
          </div>

          <div className="mt-3 flex flex-wrap gap-1">
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                onClick={() => setTimeframe(tf)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors",
                  timeframe === tf
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
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
