const tickers = [
  { symbol: 'BTC/USDT', price: '$67,234.50', change: '+1.25%', positive: true },
  { symbol: 'ETH/USDT', price: '$3,440.50', change: '+2.15%', positive: true },
  { symbol: 'XAU/USD', price: '$2,345.80', change: '+0.68%', positive: true },
  { symbol: 'AAPL', price: '$178.25', change: '+1.30%', positive: true },
  { symbol: 'TSLA', price: '$242.10', change: '-1.28%', positive: false },
  { symbol: 'SOL/USDT', price: '$148.60', change: '+4.02%', positive: true },
  { symbol: 'NVDA', price: '$875.40', change: '+2.88%', positive: true },
];

function TickerItems() {
  return (
    <>
      {tickers.map((item) => (
        <div
          key={item.symbol}
          className="flex shrink-0 items-center gap-2 px-6 text-sm"
        >
          <span className="text-foreground font-semibold">{item.symbol}</span>
          <span className="text-muted-foreground">{item.price}</span>
          <span
            className={
              item.positive
                ? 'text-success font-semibold'
                : 'text-destructive font-semibold'
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
    <div className="border-border bg-card relative bottom-[56.8] shrink-0 overflow-hidden border-t py-[18px] md:bottom-0">
      <div className="animate-ticker flex w-max">
        <TickerItems />
        <TickerItems />
      </div>
    </div>
  );
}
