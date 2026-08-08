import { describe, expect, it } from 'vitest';
import {
  PERFORMANCE_RANGES,
  assetTone,
  baseAsset,
  buildHoldings,
  formatQty,
  formatRelativeTime,
  seededSeries,
} from '@/features/portfolio/lib/portfolio-data';
import type {
  PortfolioAllocationSlice,
  PortfolioPosition,
} from '@/features/portfolio/types';

const position: PortfolioPosition = {
  id: 'pos-1',
  symbol: 'BTCUSDT',
  display_symbol: 'BTC/USDT',
  side: 'long',
  qty: 0.5,
  avg_entry_price: 60000,
  mark_price: 68000,
  unrealized_pnl: 4000,
  unrealized_pnl_pct: 13.33,
  market_value: 34000,
  is_positive: true,
};

const allocation: PortfolioAllocationSlice[] = [
  {
    symbol: 'BTCUSDT',
    display_symbol: 'BTC',
    percent: 70,
    value: 34000,
  },
  {
    symbol: 'CASH',
    display_symbol: 'Cash',
    percent: 30,
    value: 14600,
  },
];

describe('baseAsset', () => {
  it('strips known quote assets', () => {
    expect(baseAsset('BTCUSDT')).toBe('BTC');
    expect(baseAsset('AAPLUSD')).toBe('AAPL');
    expect(baseAsset('ETH')).toBe('ETH');
  });
});

describe('seededSeries', () => {
  it('is stable for the same seed and ends near the change', () => {
    const a = seededSeries('BTCUSDT', 16, 10);
    const b = seededSeries('BTCUSDT', 16, 10);
    expect(a).toEqual(b);
    expect(a).toHaveLength(16);
    expect(a[0]).toBeCloseTo(100, 5);
    expect(a[a.length - 1]).toBeCloseTo(110, 5);
  });
});

describe('buildHoldings', () => {
  it('builds position and cash rows sorted by value', () => {
    const holdings = buildHoldings([position], allocation, 48600);
    expect(holdings).toHaveLength(2);
    expect(holdings[0]?.kind).toBe('position');
    expect(holdings[0]?.asset).toBe('BTC');
    expect(holdings[0]?.allocation).toBeCloseTo(0.7);
    expect(holdings[1]?.kind).toBe('cash');
    expect(holdings[1]?.id).toBe('cash');
  });

  it('omits cash when value is zero', () => {
    const holdings = buildHoldings(
      [position],
      [{ ...allocation[0]! }, { ...allocation[1]!, value: 0 }],
      34000,
    );
    expect(holdings.every((holding) => holding.kind === 'position')).toBe(true);
  });
});

describe('format helpers', () => {
  it('formats quantities', () => {
    expect(formatQty(0.1234567)).toBe('0.123457');
    expect(formatQty(1500)).toBe('1,500');
  });

  it('formats relative time buckets', () => {
    const now = Date.parse('2026-01-01T12:00:00.000Z');
    expect(formatRelativeTime('2026-01-01T11:59:50.000Z', now)).toBe(
      'just now',
    );
    expect(formatRelativeTime('2026-01-01T11:45:00.000Z', now)).toBe('15m ago');
    expect(formatRelativeTime('2026-01-01T09:00:00.000Z', now)).toBe('3h ago');
    expect(formatRelativeTime('2025-12-30T12:00:00.000Z', now)).toBe('2d ago');
  });

  it('returns a deterministic asset tone class', () => {
    expect(assetTone('BTC')).toBe(assetTone('BTC'));
    expect(assetTone('BTC')).toMatch(/^bg-chart-\d\/12/);
  });
});

describe('PERFORMANCE_RANGES', () => {
  it('maps UI ids to API range keys', () => {
    expect(PERFORMANCE_RANGES.map((range) => range.apiRange)).toEqual([
      '1w',
      '1m',
      '3m',
      '1y',
    ]);
  });
});
