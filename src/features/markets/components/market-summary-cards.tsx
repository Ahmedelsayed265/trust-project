import Link from "next/link";
import { ArrowRight, Bot } from "lucide-react";
import { Sparkline } from "@/shared/components/sparkline";
import { routes } from "@/shared/lib/routes";

export function MarketSummaryCards() {
  return (
    <div className="grid w-full min-w-0 gap-4 xl:grid-cols-[1fr_1fr_1fr_280px]">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Market Overview
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs text-muted-foreground">Market Cap</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">
                    $2.45T
                  </span>
                  <span className="text-xs font-semibold text-success">
                    +1.28%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">24h Volume</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-foreground">
                    $98.23B
                  </span>
                  <span className="text-xs font-semibold text-success">
                    +6.42%
                  </span>
                </div>
              </div>
            </div>
          </div>
          <Sparkline
            data={[40, 42, 38, 45, 48, 46, 52, 55, 53, 58, 62]}
            className="mt-2 h-14 w-24"
            fill
            strokeWidth={2}
          />
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">Top Gainer</p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
              S
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">SOL/USDT</p>
              <p className="text-xs text-muted-foreground">Solana</p>
            </div>
          </div>
          <Sparkline
            data={[28, 30, 35, 32, 40, 45, 42, 50, 55, 58, 65]}
            className="h-10 w-20"
            strokeWidth={1.75}
          />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">$175.32</span>
          <span className="text-sm font-semibold text-success">+8.63%</span>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium text-muted-foreground">Top Loser</p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
              A
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">ADA/USDT</p>
              <p className="text-xs text-muted-foreground">Cardano</p>
            </div>
          </div>
          <Sparkline
            data={[65, 60, 58, 55, 50, 52, 48, 42, 40, 35, 32]}
            positive={false}
            className="h-10 w-20"
            strokeWidth={1.75}
          />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-bold text-foreground">$0.4587</span>
          <span className="text-sm font-semibold text-destructive">-4.21%</span>
        </div>
      </div>

      <div className="rounded-lg border border-primary/20 bg-gradient-to-br from-blue-50 to-sky-50 p-4 dark:from-blue-950/40 dark:to-slate-900">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Bot className="size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-foreground">
              AI Market Insights
            </p>
            <span className="rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              New
            </span>
          </div>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-muted-foreground">
          Get AI-powered insights and smart analysis for any asset in real-time.
        </p>
        <Link
          href={routes.aiSignals}
          className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Ask AI
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
