const segments = [
  { label: "Crypto", percent: 45.6, amount: "$11,185.89", color: "#2563eb" },
  { label: "Stocks", percent: 30.2, amount: "$7,408.20", color: "#14b8a6" },
  { label: "Metals", percent: 15.7, amount: "$3,851.28", color: "#8b5cf6" },
  { label: "Cash", percent: 8.5, amount: "$2,085.08", color: "#f59e0b" },
];

function DonutChart() {
  const size = 160;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="relative size-40 shrink-0">
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90">
        {segments.map((segment) => {
          const length = (segment.percent / 100) * circumference;
          const dashOffset = -offset;
          offset += length;
          return (
            <circle
              key={segment.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={stroke}
              strokeDasharray={`${length} ${circumference - length}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-[10px] text-muted-foreground">Total</p>
        <p className="text-sm font-bold text-foreground">$24,530.45</p>
      </div>
    </div>
  );
}

export function PortfolioDistribution() {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <h2 className="mb-4 text-base font-semibold text-foreground">
        Portfolio Distribution
      </h2>

      <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <DonutChart />

        <ul className="w-full space-y-3">
          {segments.map((segment) => (
            <li key={segment.label} className="flex items-center gap-2.5">
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: segment.color }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">
                    {segment.label}
                  </span>
                  <span className="text-sm font-semibold text-foreground">
                    {segment.percent}%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{segment.amount}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
