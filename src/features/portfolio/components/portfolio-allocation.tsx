'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatMoney } from '@/shared/trading';
import type { Holding } from '@/features/portfolio/lib/portfolio-data';

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const MAX_SLICES = 5;

export function PortfolioAllocation({
  holdings,
  currency,
  loading,
}: {
  holdings: Holding[];
  currency: string;
  loading: boolean;
}) {
  const top = holdings.slice(0, MAX_SLICES);
  const rest = holdings.slice(MAX_SLICES);

  const slices = [
    ...top.map((holding, index) => ({
      key: holding.id,
      label: holding.asset,
      caption: holding.kind === 'cash' ? 'Cash' : holding.symbol,
      value: holding.value,
      allocation: holding.allocation,
      color: PALETTE[index % PALETTE.length],
    })),
    ...(rest.length > 0
      ? [
          {
            key: 'other',
            label: 'Other',
            caption: `${rest.length} assets`,
            value: rest.reduce((sum, holding) => sum + holding.value, 0),
            allocation: rest.reduce(
              (sum, holding) => sum + holding.allocation,
              0,
            ),
            color: 'var(--muted-foreground)',
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {loading ? (
          <>
            <Skeleton className="h-2.5 w-full rounded-full" />
            <div className="space-y-3">
              {[0, 1, 2].map((index) => (
                <Skeleton key={index} className="h-9 w-full" />
              ))}
            </div>
          </>
        ) : slices.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No provider holdings to allocate yet.
          </p>
        ) : (
          <>
            <div className="bg-muted flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
              {slices.map((slice) => (
                <div
                  key={slice.key}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${Math.max(slice.allocation * 100, 1)}%`,
                    backgroundColor: slice.color,
                  }}
                  title={`${slice.label} · ${(slice.allocation * 100).toFixed(1)}%`}
                />
              ))}
            </div>

            <ul className="space-y-2.5">
              {slices.map((slice) => (
                <li
                  key={slice.key}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: slice.color }}
                    />
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {slice.label}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {slice.caption}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-foreground text-sm font-semibold">
                      {(slice.allocation * 100).toFixed(1)}%
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {formatMoney(slice.value, currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </CardContent>
    </Card>
  );
}
