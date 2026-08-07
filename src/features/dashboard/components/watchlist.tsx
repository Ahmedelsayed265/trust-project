import Link from 'next/link';
import { Star } from 'lucide-react';
import type { WatchlistItem } from '@/features/watchlist/types';
import { Sparkline } from '@/shared/components/sparkline';
import { formatMoney, formatPct } from '@/shared/trading';
import { cn } from '@/lib/utils';

type WatchlistProps = {
  items: WatchlistItem[];
};

export function Watchlist({ items }: WatchlistProps) {
  return (
    <div className="border-border bg-card h-full rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">Watchlist</h2>
        <Link
          href="/watchlist"
          className="text-primary text-sm font-medium hover:underline"
        >
          Edit
        </Link>
      </div>

      {items.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No watchlist symbols yet.{' '}
          <Link href="/markets" className="text-primary hover:underline">
            Browse markets
          </Link>
        </p>
      ) : (
        <ul className="space-y-1">
          {items.map((item) => (
            <li
              key={item.id}
              className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors"
            >
              <div
                className={cn(
                  'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                  item.icon_bg || 'bg-muted text-muted-foreground',
                )}
              >
                {item.icon_label ||
                  (item.display_symbol || item.symbol).slice(0, 1)}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-semibold">
                  {item.display_symbol || item.symbol}
                </p>
                <p className="text-muted-foreground text-xs">{item.name}</p>
              </div>

              {item.sparkline?.length ? (
                <div className="w-14 shrink-0">
                  <Sparkline
                    data={item.sparkline}
                    positive={item.is_positive}
                    className="h-7 w-full"
                    strokeWidth={1.5}
                  />
                </div>
              ) : null}

              <div className="min-w-[76px] text-right">
                <p className="text-foreground text-sm font-semibold">
                  {formatMoney(item.price)}
                </p>
                <p
                  className={
                    item.is_positive
                      ? 'text-success text-xs font-semibold'
                      : 'text-destructive text-xs font-semibold'
                  }
                >
                  {formatPct(item.change_24h_pct)}
                </p>
              </div>

              <span className="shrink-0 text-amber-400" aria-hidden>
                <Star className="size-4" fill="currentColor" />
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
