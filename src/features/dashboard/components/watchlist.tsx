import { Star } from "lucide-react";
import { Sparkline } from "@/shared/components/sparkline";

const watchlist = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$67,234.50",
    change: "+2.45%",
    positive: true,
    data: [30, 35, 32, 40, 38, 45, 48, 52],
    starred: true,
  },
  {
    symbol: "AAPL",
    name: "Apple",
    price: "$178.25",
    change: "+1.20%",
    positive: true,
    data: [40, 38, 42, 41, 45, 48, 46, 50],
    starred: true,
  },
  {
    symbol: "XAU",
    name: "Gold",
    price: "$2,345.80",
    change: "+0.85%",
    positive: true,
    data: [35, 38, 36, 40, 42, 41, 45, 48],
    starred: false,
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    price: "$3,440.50",
    change: "+3.12%",
    positive: true,
    data: [28, 32, 30, 36, 40, 38, 44, 50],
    starred: true,
  },
];

export function Watchlist() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">Watchlist</h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          Edit
        </button>
      </div>

      <ul className="space-y-1">
        {watchlist.map((item) => (
          <li
            key={item.symbol}
            className="flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors hover:bg-muted/50"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {item.symbol}
              </p>
              <p className="text-xs text-muted-foreground">{item.name}</p>
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
              <p className="text-sm font-semibold text-foreground">
                {item.price}
              </p>
              <p
                className={
                  item.positive
                    ? "text-xs font-semibold text-success"
                    : "text-xs font-semibold text-destructive"
                }
              >
                {item.change}
              </p>
            </div>

            <button
              type="button"
              className="shrink-0 text-amber-400 transition-colors hover:text-amber-500"
              aria-label={item.starred ? "Remove from favorites" : "Add to favorites"}
            >
              <Star
                className="size-4"
                fill={item.starred ? "currentColor" : "none"}
              />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
