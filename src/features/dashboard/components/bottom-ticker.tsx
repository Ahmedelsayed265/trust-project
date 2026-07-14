const tickers = [
  { symbol: "BTC/USDT", price: "$67,234.50", change: "+1.25%", positive: true },
  { symbol: "ETH/USDT", price: "$3,440.50", change: "+2.15%", positive: true },
  { symbol: "XAU/USD", price: "$2,345.80", change: "+0.68%", positive: true },
  { symbol: "AAPL", price: "$178.25", change: "+1.30%", positive: true },
  { symbol: "TSLA", price: "$242.10", change: "-1.28%", positive: false },
  { symbol: "SOL/USDT", price: "$148.60", change: "+4.02%", positive: true },
  { symbol: "NVDA", price: "$875.40", change: "+2.88%", positive: true },
];

function TickerItems() {
  return (
    <>
      {tickers.map((item) => (
        <div
          key={item.symbol}
          className="flex shrink-0 items-center gap-2 px-6 text-sm"
        >
          <span className="font-semibold text-foreground">{item.symbol}</span>
          <span className="text-muted-foreground">{item.price}</span>
          <span
            className={
              item.positive
                ? "font-semibold text-success"
                : "font-semibold text-destructive"
            }
          >
            {item.change}
          </span>
        </div>
      ))}
    </>
  );
}

export function BottomTicker() {
  return (
    <div className="relative shrink-0 overflow-hidden border-t border-border bg-card py-2.5">
      <div className="animate-ticker flex w-max">
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  );
}
