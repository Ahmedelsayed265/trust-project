'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatMoney } from '@/shared/trading';
import type { PortfolioAllocationSlice } from '@/features/portfolio/types';

const PALETTE = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
];

const MAX_SLICES = 5;

export function PortfolioAllocation({
  allocation,
  currency,
}: {
  allocation: PortfolioAllocationSlice[];
  currency: string;
}) {
  const t = useTranslations('Portfolio');
  const ranked = [...allocation].sort((a, b) => b.percent - a.percent);
  const top = ranked.slice(0, MAX_SLICES);
  const rest = ranked.slice(MAX_SLICES);

  const slices = [
    ...top.map((item, index) => ({
      key: item.symbol,
      label: item.display_symbol || item.symbol,
      caption: item.symbol === 'CASH' ? t('idleFunds') : item.symbol,
      value: item.value,
      percent: item.percent,
      color: PALETTE[index % PALETTE.length],
    })),
    ...(rest.length > 0
      ? [
          {
            key: 'other',
            label: t('otherSlice'),
            caption: t('assetsCount', { count: rest.length }),
            value: rest.reduce((sum, item) => sum + item.value, 0),
            percent: rest.reduce((sum, item) => sum + item.percent, 0),
            color: 'var(--muted-foreground)',
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('allocation')}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {slices.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            {t('allocationEmpty')}
          </p>
        ) : (
          <>
            <div className="bg-muted flex h-2.5 w-full gap-0.5 overflow-hidden rounded-full">
              {slices.map((slice) => (
                <div
                  key={slice.key}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${Math.max(slice.percent, 1)}%`,
                    backgroundColor: slice.color,
                  }}
                  title={`${slice.label} · ${slice.percent.toFixed(1)}%`}
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
                      {slice.percent.toFixed(1)}%
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
