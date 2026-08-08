'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Bot } from 'lucide-react';
import { formatCompactMoney } from '@/features/markets/lib/market-display';
import type { MarketsSummary } from '@/features/markets/types';
import { formatMoney, formatPct } from '@/shared/trading';

export function MarketSummaryCards({ summary }: { summary: MarketsSummary }) {
  const t = useTranslations('Markets');
  const tCommon = useTranslations('Common');
  const gainer = summary.top_gainer;
  const loser = summary.top_loser;

  return (
    <div className="grid w-full min-w-0 gap-4 xl:grid-cols-[1fr_1fr_1fr_280px]">
      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('marketOverview')}
        </p>
        <div className="mt-3 space-y-2">
          <div>
            <p className="text-muted-foreground text-xs">{t('symbols')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-lg font-bold">
                {summary.total_symbols}
              </span>
              <span className="text-muted-foreground text-xs">
                {t('upDown', { up: summary.gainers, down: summary.losers })}
              </span>
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">{t('volume24h')}</p>
            <div className="flex items-baseline gap-2">
              <span className="text-foreground text-lg font-bold">
                {formatCompactMoney(summary.total_volume_24h)}
              </span>
              <span
                className={
                  summary.avg_change_pct >= 0
                    ? 'text-success text-xs font-semibold'
                    : 'text-destructive text-xs font-semibold'
                }
              >
                {t('avgChange', { value: formatPct(summary.avg_change_pct) })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('topGainer')}
        </p>
        {gainer ? (
          <>
            <p className="text-foreground mt-3 text-sm font-semibold">
              {gainer.display_symbol || gainer.symbol}
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-foreground text-lg font-bold">
                {formatMoney(gainer.price)}
              </span>
              <span className="text-success text-sm font-semibold">
                {formatPct(gainer.change_24h_pct)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mt-3 text-sm">
            {tCommon('noData')}
          </p>
        )}
      </div>

      <div className="border-border bg-card rounded-lg border p-4">
        <p className="text-muted-foreground text-sm font-medium">
          {t('topLoser')}
        </p>
        {loser ? (
          <>
            <p className="text-foreground mt-3 text-sm font-semibold">
              {loser.display_symbol || loser.symbol}
            </p>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-foreground text-lg font-bold">
                {formatMoney(loser.price)}
              </span>
              <span className="text-destructive text-sm font-semibold">
                {formatPct(loser.change_24h_pct)}
              </span>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground mt-3 text-sm">
            {tCommon('noData')}
          </p>
        )}
      </div>

      <div className="border-primary/20 rounded-lg border bg-gradient-to-br from-blue-50 to-sky-50 p-4 dark:from-blue-950/40 dark:to-slate-900">
        <div className="mb-2 flex items-center gap-2">
          <div className="bg-primary/10 text-primary flex size-9 items-center justify-center rounded-xl">
            <Bot className="size-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <p className="text-foreground text-sm font-semibold">
              {t('aiInsights')}
            </p>
            <span className="bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 text-[10px] font-bold">
              {tCommon('new')}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground mb-4 text-xs leading-relaxed">
          {t('aiInsightsDesc')}
        </p>
        <Link
          href="/ai-signals"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-colors"
        >
          {t('askAi')}
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
