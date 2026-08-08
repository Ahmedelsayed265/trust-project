import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import type { WatchlistItem } from '@/features/watchlist/types';
import { Sparkline } from '@/shared/components/sparkline';
import { formatMoney, formatPct } from '@/shared/trading';
import { cn } from '@/lib/utils';

type MarketHighlightsProps = {
  items: WatchlistItem[];
};

export async function MarketHighlights({ items }: MarketHighlightsProps) {
  const t = await getTranslations('Dashboard');
  const tCommon = await getTranslations('Common');

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">
          {t('marketHighlights')}
        </h2>
        <Link
          href="/markets"
          className="text-primary text-sm font-medium hover:underline"
        >
          {tCommon('viewAll')}
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">{t('noHighlights')}</p>
      ) : (
        <div className="space-y-3">
          {items.map((market) => (
            <div
              key={market.id ?? market.symbol}
              className="border-border/80 bg-muted/30 flex items-center gap-3 rounded-xl border px-3.5 py-3"
            >
              <div
                className={cn(
                  'flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
                  market.icon_bg || 'bg-muted text-muted-foreground',
                )}
              >
                {market.icon_label ||
                  (market.display_symbol || market.symbol).slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold">
                  {market.display_symbol || market.symbol}
                </p>
                <p className="text-muted-foreground text-xs">{market.name}</p>
              </div>

              {market.sparkline?.length ? (
                <div className="w-16 shrink-0 sm:w-20">
                  <Sparkline
                    data={market.sparkline}
                    positive={market.is_positive}
                    className="h-8 w-full"
                    strokeWidth={1.75}
                  />
                </div>
              ) : null}

              <div className="min-w-[88px] text-right">
                <p className="text-foreground text-sm font-semibold">
                  {formatMoney(market.price)}
                </p>
                <p
                  className={
                    market.is_positive
                      ? 'text-success text-xs font-semibold'
                      : 'text-destructive text-xs font-semibold'
                  }
                >
                  {formatPct(market.change_24h_pct)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
