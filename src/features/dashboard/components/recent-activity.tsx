const activities = [
  {
    symbol: "BTC/USDT",
    type: "Buy" as const,
    amount: "0.05 BTC",
    value: "$3,361.72",
    time: "Today, 14:32",
    iconBg: "bg-orange-100 text-orange-600",
    icon: "₿",
  },
  {
    symbol: "AAPL",
    type: "Buy" as const,
    amount: "15 shares",
    value: "$2,673.75",
    time: "Today, 11:15",
    iconBg: "bg-slate-100 text-slate-700",
    icon: "",
  },
  {
    symbol: "XAU/USD",
    type: "Sell" as const,
    amount: "2.5 oz",
    value: "$5,864.50",
    time: "Yesterday, 16:48",
    iconBg: "bg-yellow-100 text-yellow-700",
    icon: "Au",
  },
  {
    symbol: "ETH/USDT",
    type: "Buy" as const,
    amount: "1.2 ETH",
    value: "$4,128.60",
    time: "Yesterday, 09:22",
    iconBg: "bg-indigo-100 text-indigo-600",
    icon: "Ξ",
  },
];

export function RecentActivity() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-foreground">
          Recent Activity
        </h2>
        <button
          type="button"
          className="text-sm font-medium text-primary hover:underline"
        >
          See All
        </button>
      </div>

      <ul className="space-y-1">
        {activities.map((item) => (
          <li
            key={`${item.symbol}-${item.time}`}
            className="flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors hover:bg-muted/50"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.iconBg}`}
            >
              {item.symbol === "AAPL" ? (
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              ) : (
                item.icon
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-foreground">
                  {item.symbol}
                </p>
                <span
                  className={
                    item.type === "Buy"
                      ? "text-xs font-semibold text-success"
                      : "text-xs font-semibold text-destructive"
                  }
                >
                  {item.type}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{item.time}</p>
            </div>

            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {item.value}
              </p>
              <p className="text-xs text-muted-foreground">{item.amount}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
