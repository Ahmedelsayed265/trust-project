import { Sparkline } from "@/shared/components/sparkline";

const markets = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: "$67,234.50",
    change: "+2.45%",
    positive: true,
    data: [30, 32, 28, 35, 38, 36, 42, 45, 43, 48, 52],
    iconBg: "bg-orange-100 text-orange-600",
    icon: "₿",
  },
  {
    symbol: "XAU/USD",
    name: "Gold",
    price: "$2,345.80",
    change: "+0.85%",
    positive: true,
    data: [40, 38, 42, 41, 45, 44, 46, 48, 47, 50, 52],
    iconBg: "bg-yellow-100 text-yellow-700",
    icon: "Au",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$178.25",
    change: "+1.20%",
    positive: true,
    data: [35, 38, 36, 40, 42, 39, 44, 46, 45, 48, 50],
    iconBg: "bg-slate-100 text-slate-700",
    icon: "",
  },
];

export function MarketHighlights() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Market Highlights
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {markets.map((market) => (
          <div
            key={market.symbol}
            className="flex items-center gap-3 rounded-xl border border-border/80 bg-muted/30 px-3.5 py-3"
          >
            <div
              className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${market.iconBg}`}
            >
              {market.symbol === "AAPL" ? (
                <svg viewBox="0 0 24 24" className="size-5 fill-current" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              ) : (
                market.icon
              )}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {market.symbol}
              </p>
              <p className="text-xs text-muted-foreground">{market.name}</p>
            </div>

            <div className="w-16 shrink-0 sm:w-20">
              <Sparkline
                data={market.data}
                positive={market.positive}
                className="h-8 w-full"
                strokeWidth={1.75}
              />
            </div>

            <div className="min-w-[88px] text-right">
              <p className="text-sm font-semibold text-foreground">
                {market.price}
              </p>
              <p className="text-xs font-semibold text-success">{market.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
