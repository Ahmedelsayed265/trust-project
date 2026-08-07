import Link from 'next/link';
import type { HomeAllocation } from '@/features/dashboard/types';
import { formatMoney } from '@/shared/trading';

const palette = [
  '#2563eb',
  '#14b8a6',
  '#8b5cf6',
  '#f59e0b',
  '#64748b',
  '#ec4899',
];

type PortfolioDistributionProps = {
  allocation: HomeAllocation[];
  equity: number;
  currency: string;
  hasAccounts: boolean;
};

export function PortfolioDistribution({
  allocation,
  equity,
  currency,
  hasAccounts,
}: PortfolioDistributionProps) {
  const segments = allocation.map((item, i) => ({
    label: item.display_symbol || item.symbol,
    percent: item.percent,
    amount: formatMoney(item.value, currency),
    color: palette[i % palette.length],
  }));

  return (
    <div className="border-border bg-card rounded-lg border p-5">
      <h2 className="text-foreground mb-4 text-base font-semibold">
        Portfolio Distribution
      </h2>

      {!hasAccounts || segments.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          {hasAccounts
            ? 'No allocation data yet.'
            : 'Connect a provider to see allocation.'}
        </p>
      ) : (
        <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          <DonutChart
            segments={segments}
            total={formatMoney(equity, currency)}
          />

          <ul className="w-full space-y-3">
            {segments.map((segment) => (
              <li key={segment.label} className="flex items-center gap-2.5">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-foreground text-sm font-medium">
                      {segment.label}
                    </span>
                    <span className="text-foreground text-sm font-semibold">
                      {segment.percent.toFixed(1)}%
                    </span>
                  </div>
                  <p className="text-muted-foreground text-xs">
                    {segment.amount}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {hasAccounts ? (
        <Link
          href="/portfolio"
          className="text-primary mt-4 inline-block text-sm font-medium hover:underline"
        >
          View portfolio
        </Link>
      ) : null}
    </div>
  );
}

function DonutChart({
  segments,
  total,
}: {
  segments: { label: string; percent: number; color: string }[];
  total: string;
}) {
  const size = 160;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const chartSegments = segments.reduce<
    { label: string; color: string; length: number; dashOffset: number }[]
  >((acc, segment) => {
    const length = (segment.percent / 100) * circumference;
    const prevEnd = acc.at(-1);
    const start = prevEnd ? -prevEnd.dashOffset + prevEnd.length : 0;
    acc.push({
      label: segment.label,
      color: segment.color,
      length,
      dashOffset: -start,
    });
    return acc;
  }, []);

  return (
    <div className="relative size-40 shrink-0">
      <svg viewBox={`0 0 ${size} ${size}`} className="size-full -rotate-90">
        {chartSegments.map((segment) => (
          <circle
            key={segment.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={segment.color}
            strokeWidth={stroke}
            strokeDasharray={`${segment.length} ${circumference - segment.length}`}
            strokeDashoffset={segment.dashOffset}
            strokeLinecap="butt"
          />
        ))}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-muted-foreground text-[10px]">Equity</p>
        <p className="text-foreground text-sm font-bold">{total}</p>
      </div>
    </div>
  );
}
