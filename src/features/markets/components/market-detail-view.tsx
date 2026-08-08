'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ArrowLeftRight, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  formatCompactMoney,
  isWatchlisted,
  marketIconBg,
} from '@/features/markets/lib/market-display';
import type {
  MarketSymbol,
  MarketSymbolDetail,
} from '@/features/markets/types';
import { toggleWatchlistAction } from '@/features/watchlist/actions/watchlist';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/shared/components/page-header';
import { Sparkline } from '@/shared/components/sparkline';
import { formatMoney, formatPct } from '@/shared/trading';

export function MarketDetailView({
  initialData,
}: {
  initialData: MarketSymbolDetail;
}) {
  const t = useTranslations('Markets');
  const tCommon = useTranslations('Common');
  const [watching, setWatching] = useState(
    isWatchlisted(initialData.is_watchlisted),
  );
  const [, startToggle] = useTransition();

  function assetClassLabel(assetClass: string) {
    if (
      assetClass === 'crypto' ||
      assetClass === 'stocks' ||
      assetClass === 'metals' ||
      assetClass === 'forex' ||
      assetClass === 'indices'
    ) {
      return t(`assetClass.${assetClass}`);
    }
    return assetClass;
  }

  function onToggleWatchlist() {
    const previous = watching;
    setWatching(!previous);

    startToggle(async () => {
      const result = await toggleWatchlistAction(initialData.symbol);
      if (!result.ok) {
        setWatching(previous);
        toast.error(result.message);
        return;
      }

      const next = result.data.watching ?? result.data.in_watchlist;
      if (typeof next === 'boolean') setWatching(next);
    });
  }

  const stats = [
    { label: t('high24h'), value: formatMoney(initialData.high_24h ?? 0) },
    { label: t('low24h'), value: formatMoney(initialData.low_24h ?? 0) },
    {
      label: t('volume24h'),
      value:
        initialData.quote_volume_24h != null
          ? formatCompactMoney(initialData.quote_volume_24h)
          : '—',
    },
    {
      label: t('marketCap'),
      value:
        initialData.market_cap != null
          ? formatCompactMoney(initialData.market_cap)
          : '—',
    },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={initialData.display_symbol || initialData.symbol}
        description={initialData.name}
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/markets" />}
          >
            <ArrowLeft className="size-4" />
            {tCommon('back')}
          </Button>
        }
      />

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex min-w-0 items-center gap-3">
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
                marketIconBg(initialData.asset_class),
              )}
            >
              {initialData.icon_label || initialData.display_symbol.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CardTitle className="text-base">
                  {initialData.display_symbol || initialData.symbol}
                </CardTitle>
                <Badge variant="secondary" className="border-0">
                  {assetClassLabel(initialData.asset_class)}
                </Badge>
              </div>
              <p className="text-muted-foreground text-xs">
                {initialData.provider_id} · {initialData.base_asset}/
                {initialData.quote_asset}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onToggleWatchlist}
            className={cn(
              'rounded-lg p-2 transition-colors',
              watching
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary',
            )}
            aria-label={t('toggleWatchlist')}
          >
            <Star
              className="size-5"
              fill={watching ? 'currentColor' : 'none'}
            />
          </button>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-foreground text-3xl font-bold tracking-tight">
                {formatMoney(initialData.price)}
              </p>
              <p
                className={cn(
                  'mt-1 text-sm font-semibold',
                  initialData.is_positive ? 'text-success' : 'text-destructive',
                )}
              >
                {formatPct(initialData.change_24h_pct)} ·{' '}
                {formatMoney(Math.abs(initialData.change_24h))}
              </p>
            </div>
            {initialData.sparkline.length > 0 ? (
              <Sparkline
                data={initialData.sparkline}
                positive={initialData.is_positive}
                className="h-14 w-40"
                fill
                strokeWidth={2}
              />
            ) : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border rounded-xl border px-3 py-2.5"
              >
                <p className="text-muted-foreground text-xs">{stat.label}</p>
                <p className="text-foreground mt-1 text-sm font-semibold">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            {initialData.is_tradable ? (
              <Button
                className="rounded-xl"
                render={
                  <Link
                    href={`/trades?symbol=${encodeURIComponent(initialData.symbol)}`}
                  />
                }
              >
                <ArrowLeftRight className="size-4" />
                {t('trade')}
              </Button>
            ) : null}
            <Button
              variant="outline"
              className="rounded-xl"
              render={
                <Link
                  href={`/ai-signals?symbol=${encodeURIComponent(initialData.symbol)}`}
                />
              }
            >
              <Sparkles className="size-4" />
              {t('signalsCount', { count: initialData.active_signals })}
            </Button>
          </div>
        </CardContent>
      </Card>

      {initialData.related.length > 0 ? (
        <div className="space-y-3">
          <h2 className="text-foreground text-sm font-semibold">
            {t('relatedMarkets')}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {initialData.related.map((item) => (
              <RelatedMarketCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function RelatedMarketCard({ item }: { item: MarketSymbol }) {
  return (
    <Link
      href={`/markets/${encodeURIComponent(item.symbol)}`}
      className="block"
    >
      <Card className="bg-card hover:bg-card hover:border-primary/40 transition-colors">
        <CardContent className="space-y-2 pt-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-8 items-center justify-center rounded-full text-xs font-bold',
                marketIconBg(item.asset_class),
              )}
            >
              {item.icon_label || item.display_symbol.slice(0, 1)}
            </div>
            <div className="min-w-0">
              <p className="text-foreground truncate text-sm font-semibold">
                {item.display_symbol || item.symbol}
              </p>
              <p className="text-muted-foreground truncate text-xs">
                {item.name}
              </p>
            </div>
          </div>
          <div className="flex items-baseline justify-between gap-2">
            <span className="text-foreground text-sm font-semibold">
              {formatMoney(item.price)}
            </span>
            <span
              className={cn(
                'text-xs font-semibold',
                item.is_positive ? 'text-success' : 'text-destructive',
              )}
            >
              {formatPct(item.change_24h_pct)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
