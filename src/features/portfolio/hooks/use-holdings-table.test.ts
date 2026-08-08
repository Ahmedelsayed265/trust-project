import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useHoldingsTable } from '@/features/portfolio/hooks/use-holdings-table';
import type { Holding } from '@/features/portfolio/lib/portfolio-data';

const holdings: Holding[] = [
  {
    id: 'btc',
    symbol: 'BTC/USDT',
    asset: 'BTC',
    kind: 'position',
    side: 'long',
    qty: 1,
    avgEntryPrice: 60000,
    markPrice: 68000,
    value: 68000,
    pnl: 8000,
    pnlPct: 13,
    positive: true,
    allocation: 0.7,
    series: [],
  },
  {
    id: 'eth',
    symbol: 'ETH/USDT',
    asset: 'ETH',
    kind: 'position',
    side: 'long',
    qty: 2,
    avgEntryPrice: 3000,
    markPrice: 2900,
    value: 5800,
    pnl: -200,
    pnlPct: -3,
    positive: false,
    allocation: 0.1,
    series: [],
  },
  {
    id: 'cash',
    symbol: 'Cash',
    asset: 'Cash',
    kind: 'cash',
    side: null,
    qty: 20000,
    avgEntryPrice: null,
    markPrice: null,
    value: 20000,
    pnl: 0,
    pnlPct: 0,
    positive: true,
    allocation: 0.2,
    series: [],
  },
];

describe('useHoldingsTable', () => {
  it('filters by holding kind', () => {
    const { result } = renderHook(() => useHoldingsTable(holdings));

    act(() => {
      result.current.setFilter('cash');
    });

    expect(result.current.rows.map((row) => row.id)).toEqual(['cash']);
  });

  it('sorts by value descending by default', () => {
    const { result } = renderHook(() => useHoldingsTable(holdings));
    expect(result.current.rows.map((row) => row.id)).toEqual([
      'btc',
      'cash',
      'eth',
    ]);
  });

  it('toggles sort direction for the same key', () => {
    const { result } = renderHook(() => useHoldingsTable(holdings));

    act(() => {
      result.current.toggleSort('value');
    });

    expect(result.current.descending).toBe(false);
    expect(result.current.rows.map((row) => row.id)).toEqual([
      'eth',
      'cash',
      'btc',
    ]);
  });

  it('defaults asset sort to ascending', () => {
    const { result } = renderHook(() => useHoldingsTable(holdings));

    act(() => {
      result.current.toggleSort('asset');
    });

    expect(result.current.sortKey).toBe('asset');
    expect(result.current.descending).toBe(false);
    expect(result.current.rows.map((row) => row.asset)).toEqual([
      'BTC',
      'Cash',
      'ETH',
    ]);
  });
});
