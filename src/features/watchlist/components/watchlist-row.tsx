'use client';

import { useTranslations } from 'next-intl';
import { Star } from 'lucide-react';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import { Sparkline } from '@/shared/components/sparkline';
import { watchlistIconBg } from '@/features/watchlist/lib/watchlist-display';
import type { WatchlistItem } from '@/features/watchlist/types';
import { cn } from '@/lib/utils';
import { formatMoney, formatPct } from '@/shared/trading';

type WatchlistRowProps = {
  item: WatchlistItem;
  onRemove?: () => void;
  removing?: boolean;
};

export function WatchlistRow({ item, onRemove, removing }: WatchlistRowProps) {
  const t = useTranslations('Watchlist');
  const symbol = item.display_symbol || item.symbol;

  return (
    <li className="flex items-center gap-3 px-4 py-3.5 sm:px-5">
      <div
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold',
          watchlistIconBg(item.asset_class),
        )}
      >
        {item.icon_label || item.display_symbol.slice(0, 1)}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-foreground text-sm font-semibold">{symbol}</p>
        <p className="text-muted-foreground text-xs">{item.name}</p>
      </div>

      {item.sparkline.length > 0 ? (
        <Sparkline
          data={item.sparkline}
          positive={item.is_positive}
          className="hidden h-8 w-20 sm:block"
        />
      ) : null}

      <div className="min-w-[88px] text-right">
        <p className="text-foreground text-sm font-semibold">
          {formatMoney(item.price)}
        </p>
        <ChangeIndicator
          value={formatPct(item.change_24h_pct)}
          positive={item.is_positive}
          className="text-xs"
        />
      </div>

      {onRemove ? (
        <button
          type="button"
          onClick={onRemove}
          disabled={removing}
          className="text-primary transition-colors hover:opacity-80 disabled:opacity-50"
          aria-label={t('removeAria', { symbol })}
        >
          <Star className="size-4" fill="currentColor" />
        </button>
      ) : null}
    </li>
  );
}
