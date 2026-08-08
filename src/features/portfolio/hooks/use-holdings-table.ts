'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Holding } from '@/features/portfolio/lib/portfolio-data';

export type HoldingsSortKey = 'value' | 'allocation' | 'pnl' | 'asset';
export type HoldingsFilter = 'all' | 'position' | 'cash';

export const HOLDINGS_FILTERS: { id: HoldingsFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'position', label: 'Positions' },
  { id: 'cash', label: 'Cash' },
];

export function useHoldingsTable(holdings: Holding[]) {
  const [filter, setFilter] = useState<HoldingsFilter>('all');
  const [sortKey, setSortKey] = useState<HoldingsSortKey>('value');
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

  const toggleSort = useCallback(
    (key: HoldingsSortKey) => {
      if (key === sortKey) {
        setDescending((value) => !value);
        return;
      }
      setSortKey(key);
      setDescending(key !== 'asset');
    },
    [sortKey],
  );

  return { filter, setFilter, sortKey, descending, toggleSort, rows };
}
