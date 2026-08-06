'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpDown, ArrowLeftRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkline } from '@/shared/components/sparkline';
import { cn } from '@/lib/utils';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';
import {
  assetTone,
  formatQty,
  type Holding,
} from '@/features/portfolio/lib/portfolio-data';

type SortKey = 'value' | 'allocation' | 'pnl' | 'asset';
type Filter = 'all' | 'position' | 'cash';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'position', label: 'Positions' },
  { id: 'cash', label: 'Cash' },
];

export function PortfolioHoldings({
  holdings,
  currency,
  loading,
}: {
  holdings: Holding[];
  currency: string;
  loading: boolean;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [sortKey, setSortKey] = useState<SortKey>('value');
  const [descending, setDescending] = useState(true);

  const rows = useMemo(() => {
    const filtered = holdings.filter(
      (holding) => filter === 'all' || holding.kind === filter,
    );

    const sorted = [...filtered].sort((a, b) => {
      if (sortKey === 'asset') return a.asset.localeCompare(b.asset);
      if (sortKey === 'allocation') return a.allocation - b.allocation;
      if (sortKey === 'pnl') return a.pnl - b.pnl;
      return a.value - b.value;
    });

    return descending ? sorted.reverse() : sorted;
  }, [holdings, filter, sortKey, descending]);

  function toggleSort(key: SortKey) {
    if (key === sortKey) {
      setDescending((value) => !value);
      return;
    }
    setSortKey(key);
    setDescending(key !== 'asset');
  }

  const sortable = (key: SortKey, label: string, align: 'left' | 'right') => (
    <button
      type="button"
      onClick={() => toggleSort(key)}
      className={cn(
        'hover:text-foreground inline-flex items-center gap-1 transition-colors',
        sortKey === key && 'text-foreground',
        align === 'right' && 'flex-row-reverse',
      )}
    >
      {label}
      <ArrowUpDown className="size-3" />
    </button>
  );

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Holdings</CardTitle>

        <div className="bg-muted flex shrink-0 items-center gap-0.5 rounded-lg p-0.5">
          {FILTERS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                item.id === filter
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-0">
        {loading ? (
          <div className="space-y-2 px-(--card-spacing)">
            {[0, 1, 2].map((index) => (
              <Skeleton key={index} className="h-14 w-full" />
            ))}
          </div>
        ) : (
          <div className="w-full max-w-full scrollbar-thin overflow-x-auto overscroll-x-contain">
            <table className="w-full min-w-[840px] text-left">
              <thead>
                <tr className="border-border text-muted-foreground border-b text-xs font-medium">
                  <th className="px-4 py-2.5 font-medium">
                    {sortable('asset', 'Asset', 'left')}
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    Quantity
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    Avg entry
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">Mark</th>
                  <th className="px-4 py-2.5 font-medium">
                    {sortable('allocation', 'Allocation', 'left')}
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    {sortable('value', 'Value', 'right')}
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    {sortable('pnl', 'Unrealized P&L', 'right')}
                  </th>
                  <th className="px-4 py-2.5 font-medium">Trend</th>
                  <th className="px-4 py-2.5 font-medium">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="text-muted-foreground px-4 py-10 text-center text-sm"
                    >
                      No holdings in this view.
                    </td>
                  </tr>
                ) : (
                  rows.map((holding) => {
                    const positive = holding.pnl >= 0;

                    return (
                      <tr
                        key={holding.id}
                        className="border-border/70 hover:bg-muted/40 border-b transition-colors last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span
                              className={cn(
                                'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
                                assetTone(holding.asset),
                              )}
                            >
                              {holding.asset.slice(0, 3)}
                            </span>
                            <div className="min-w-0">
                              <p className="text-foreground text-sm font-semibold">
                                {holding.symbol}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                {holding.kind === 'cash'
                                  ? 'Free balance'
                                  : 'Spot position'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="text-foreground px-4 py-3 text-right text-sm">
                          {formatQty(holding.qty)}
                        </td>

                        <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                          {holding.avgEntryPrice != null
                            ? formatMoney(holding.avgEntryPrice, currency)
                            : '—'}
                        </td>

                        <td className="text-foreground px-4 py-3 text-right text-sm">
                          {holding.markPrice != null
                            ? formatMoney(holding.markPrice, currency)
                            : '—'}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{
                                  width: `${Math.min(holding.allocation * 100, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-muted-foreground text-xs font-medium">
                              {(holding.allocation * 100).toFixed(1)}%
                            </span>
                          </div>
                        </td>

                        <td className="text-foreground px-4 py-3 text-right text-sm font-semibold">
                          {formatMoney(holding.value, currency)}
                        </td>

                        <td className="px-4 py-3 text-right">
                          {holding.kind === 'cash' ? (
                            <span className="text-muted-foreground text-sm">
                              —
                            </span>
                          ) : (
                            <>
                              <p
                                className={cn(
                                  'text-sm font-semibold',
                                  positive
                                    ? 'text-success'
                                    : 'text-destructive',
                                )}
                              >
                                {formatSignedMoney(holding.pnl, currency)}
                              </p>
                              <p
                                className={cn(
                                  'text-xs',
                                  positive
                                    ? 'text-success/80'
                                    : 'text-destructive/80',
                                )}
                              >
                                {formatPct(holding.pnlPct)}
                              </p>
                            </>
                          )}
                        </td>

                        <td className="px-4 py-3">
                          <Sparkline
                            data={holding.series}
                            positive={positive}
                            className="h-8 w-20"
                            strokeWidth={1.75}
                          />
                        </td>

                        <td className="px-4 py-3">
                          <Link
                            href={`/trades?symbol=${encodeURIComponent(holding.symbol)}`}
                            className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors"
                          >
                            <ArrowLeftRight className="size-3.5" />
                            Trade
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
