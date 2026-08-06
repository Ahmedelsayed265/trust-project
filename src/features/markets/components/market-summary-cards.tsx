import Link from 'next/link';
import { ArrowRight, Bot } from 'lucide-react';
import { Sparkline } from '@/shared/components/sparkline';
export function MarketSummaryCards() {
  return (
    <div className="grid w-full min-w-0 gap-4 xl:grid-cols-[1fr_1fr_1fr_280px]">
      <div className="border-border bg-card rounded-lg border p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-sm font-medium">
              Market Overview
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-muted-foreground text-xs">Market Cap</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-lg font-bold">
                    $2.45T
                  </span>
                  <span className="text-success text-xs font-semibold">
                    +1.28%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs">24h Volume</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-foreground text-lg font-bold">
                    $98.23B
                  </span>
                  <span className="text-success text-xs font-semibold">
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

      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-muted-foreground text-sm font-medium">Top Gainer</p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-700">
              S
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">SOL/USDT</p>
              <p className="text-muted-foreground text-xs">Solana</p>
            </div>
          </div>
          <Sparkline
            data={[28, 30, 35, 32, 40, 45, 42, 50, 55, 58, 65]}
            className="h-10 w-20"
            strokeWidth={1.75}
          />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-foreground text-lg font-bold">$175.32</span>
          <span className="text-success text-sm font-semibold">+8.63%</span>
        </div>
      </div>

      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-muted-foreground text-sm font-medium">Top Loser</p>
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
              A
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">ADA/USDT</p>
              <p className="text-muted-foreground text-xs">Cardano</p>
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
          <span className="text-foreground text-lg font-bold">$0.4587</span>
          <span className="text-destructive text-sm font-semibold">-4.21%</span>
        </div>
      </div>

      <div className="border-primary/20 rounded-lg border bg-gradient-to-br from-blue-50 to-sky-50 p-4 dark:from-blue-950/40 dark:to-slate-900">
        <div className="mb-2 flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
            <Bot className="size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-foreground text-sm font-semibold">
              AI Market Insights
            </p>
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              New
            </span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
          Get AI-powered insights and smart analysis for any asset in real-time.
        </p>
        <Link
          href="/ai-signals"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors"
        >
          Ask AI
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
