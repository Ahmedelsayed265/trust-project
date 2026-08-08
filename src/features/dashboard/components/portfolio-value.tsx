'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Eye, Link2, TrendingDown, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import type { HomePortfolio } from '@/features/dashboard/types';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/shared/components/sparkline';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';

const timeframes = ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const;

const chartByTimeframe: Record<(typeof timeframes)[number], number[]> = {
  '1D': [42, 45, 43, 48, 52, 50, 55, 58, 54, 60, 63, 68, 65, 72, 78],
  '1W': [38, 41, 44, 42, 48, 51, 49, 55, 58, 61, 59, 64, 70, 73, 78],
  '1M': [30, 34, 32, 38, 42, 40, 46, 50, 48, 55, 58, 62, 66, 71, 78],
  '3M': [22, 28, 25, 33, 37, 35, 42, 48, 45, 52, 57, 60, 65, 72, 78],
  '1Y': [18, 24, 30, 28, 36, 42, 40, 48, 52, 50, 58, 64, 68, 74, 78],
  ALL: [12, 18, 22, 28, 26, 34, 40, 38, 46, 52, 55, 62, 68, 74, 78],
};

type PortfolioValueProps = {
  portfolio: HomePortfolio;
  plan?: string;
  accountsCount?: number;
};

export function PortfolioValue({
  portfolio,
  plan,
  accountsCount = 0,
}: PortfolioValueProps) {
  const t = useTranslations('Dashboard');
  const tCommon = useTranslations('Common');
  const [timeframe, setTimeframe] = useState<(typeof timeframes)[number]>('1D');
  const chartData = chartByTimeframe[timeframe];
  const { currency, equity, day_pnl, day_pnl_pct, is_positive, has_accounts } =
    portfolio;
  const PnlIcon = is_positive ? TrendingUp : TrendingDown;
  const pnlTone = is_positive
    ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
    : 'text-destructive bg-red-50 dark:bg-red-950/40';

  return (
    <div className="border-border bg-card rounded-[12px] border px-5 py-6 shadow-none sm:px-6 sm:py-7">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
        <div className="flex min-w-0 flex-1 flex-col justify-between gap-5">
          <div>
            <div className="text-muted-foreground mb-3 flex flex-wrap items-center gap-2 text-sm">
              <span>{t('totalEquity')}</span>
              <Eye className="size-3.5 opacity-70" />
              {plan ? (
                <span className="border-border rounded-md border px-2 py-0.5 text-[11px] font-semibold">
                  {plan}
                </span>
              ) : null}
              {has_accounts ? (
                <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[11px] font-semibold">
                  {t('linkedCount', { count: accountsCount })}
                </span>
              ) : (
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300">
                  {t('noAccounts')}
                </span>
              )}
            </div>

            <p className="text-foreground text-3xl font-bold tracking-tight sm:text-4xl">
              {formatMoney(equity, currency)}
            </p>

            {has_accounts ? (
              <div
                className={cn(
                  'mt-2.5 inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-semibold',
                  pnlTone,
                )}
              >
                <PnlIcon className="size-3.5" />
                <span>
                  {formatSignedMoney(day_pnl, currency)} (
                  {formatPct(day_pnl_pct)})
                </span>
              </div>
            ) : (
              <p className="text-muted-foreground mt-2 text-sm">
                {t('connectBrokerHint')}
              </p>
            )}
          </div>

          <div className="flex gap-2.5">
            <Link
              href="/accounts"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              <Link2 className="size-4" />
              {has_accounts
                ? tCommon('manageAccounts')
                : tCommon('connectAccount')}
            </Link>
            <Link
              href="/trades"
              className="border-primary text-primary hover:bg-accent rounded-md border bg-transparent px-5 py-2.5 text-sm font-semibold transition-colors"
            >
              {tCommon('trade')}
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 flex-col lg:max-w-md">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                {t('dayPnl')}
              </p>
              <p
                className={cn(
                  'mt-1 text-lg font-semibold tracking-tight',
                  is_positive ? 'text-success' : 'text-destructive',
                )}
              >
                {formatSignedMoney(day_pnl, currency)}
                <span
                  className={cn(
                    'ml-1.5 text-sm font-medium',
                    is_positive ? 'text-success/80' : 'text-destructive/80',
                  )}
                >
                  ({formatPct(day_pnl_pct)})
                </span>
              </p>
            </div>
            <span className="border-border text-muted-foreground rounded-md border px-2 py-0.5 text-[11px] font-semibold">
              {timeframe}
            </span>
          </div>

          <div className="relative min-h-30 flex-1">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between"
            >
              <div className="border-border/80 border-t border-dashed" />
              <div className="border-border/80 border-t border-dashed" />
              <div className="border-border/80 border-t border-dashed" />
            </div>
            <Sparkline
              data={chartData}
              positive={is_positive}
              fill
              showDot
              className="relative h-full min-h-30 w-full"
              strokeWidth={2.25}
            />
          </div>

          <div
            role="tablist"
            aria-label={t('chartTimeframeAria')}
            className="border-border bg-card mt-4 flex rounded-md border p-1"
          >
            {timeframes.map((tf) => (
              <button
                key={tf}
                type="button"
                role="tab"
                aria-selected={timeframe === tf}
                onClick={() => setTimeframe(tf)}
                className={cn(
                  'flex-1 rounded-[6px] px-2 py-1.5 text-xs font-semibold transition-colors',
                  timeframe === tf
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
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
