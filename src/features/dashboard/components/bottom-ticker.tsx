import type { MarketTickerItem } from '@/features/markets/types';
import { formatMoney, formatPct } from '@/shared/trading';

function TickerItems({ items }: { items: MarketTickerItem[] }) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.symbol}
          className="flex shrink-0 items-center gap-2 px-6 text-sm"
        >
          <span className="text-foreground font-semibold">
            {item.display_symbol || item.symbol}
          </span>
          <span className="text-muted-foreground">
            {formatMoney(item.price)}
          </span>
          <span
            className={
              item.is_positive
                ? 'text-success font-semibold'
                : 'text-destructive font-semibold'
            }
          >
            {formatPct(item.change_24h_pct)}
          </span>
        </div>
      ))}
    </>
  );
}

export function BottomTicker({ items }: { items: MarketTickerItem[] }) {
  if (items.length === 0) return null;

  return (
    <div className="border-border bg-card relative bottom-[56.8] shrink-0 overflow-hidden border-t py-4.5 md:bottom-0">
      <div className="animate-ticker flex w-max">
        <TickerItems items={items} />
        <TickerItems items={items} />
      </div>
    </div>
  );
}
