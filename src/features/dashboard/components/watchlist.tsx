import { Star } from 'lucide-react';
import { Sparkline } from '@/shared/components/sparkline';

const watchlist = [
  {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '$67,234.50',
    change: '+2.45%',
    positive: true,
    data: [30, 35, 32, 40, 38, 45, 48, 52],
    starred: true,
  },
  {
    symbol: 'AAPL',
    name: 'Apple',
    price: '$178.25',
    change: '+1.20%',
    positive: true,
    data: [40, 38, 42, 41, 45, 48, 46, 50],
    starred: true,
  },
  {
    symbol: 'XAU',
    name: 'Gold',
    price: '$2,345.80',
    change: '+0.85%',
    positive: true,
    data: [35, 38, 36, 40, 42, 41, 45, 48],
    starred: false,
  },
  {
    symbol: 'ETH',
    name: 'Ethereum',
    price: '$3,440.50',
    change: '+3.12%',
    positive: true,
    data: [28, 32, 30, 36, 40, 38, 44, 50],
    starred: true,
  },
];

export function Watchlist() {
  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">Watchlist</h2>
        <button
          type="button"
          className="text-primary text-sm font-medium hover:underline"
        >
          Edit
        </button>
      </div>

      <ul className="space-y-1">
        {watchlist.map((item) => (
          <li
            key={item.symbol}
            className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors"
          >
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-semibold">
                {item.symbol}
              </p>
              <p className="text-muted-foreground text-xs">{item.name}</p>
            </div>

            <div className="w-14 shrink-0">
              <Sparkline
                data={item.data}
                positive={item.positive}
                className="h-7 w-full"
                strokeWidth={1.5}
              />
            </div>

            <div className="min-w-[76px] text-right">
              <p className="text-foreground text-sm font-semibold">
                {item.price}
              </p>
              <p
                className={
                  item.positive
                    ? 'text-success text-xs font-semibold'
                    : 'text-destructive text-xs font-semibold'
                }
              >
                {item.change}
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-amber-400 transition-colors hover:text-amber-500"
              aria-label={
                item.starred ? 'Remove from favorites' : 'Add to favorites'
              }
            >
              <Star
                className="size-4"
                fill={item.starred ? 'currentColor' : 'none'}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
