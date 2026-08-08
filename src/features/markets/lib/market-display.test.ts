import { describe, expect, it } from 'vitest';
import {
  assetClassLabel,
  formatCompactMoney,
  isWatchlisted,
  marketIconBg,
} from '@/features/markets/lib/market-display';

describe('marketIconBg', () => {
  it('returns class for known asset classes and a fallback', () => {
    expect(marketIconBg('crypto')).toContain('orange');
    expect(marketIconBg('unknown')).toBe('bg-muted text-muted-foreground');
  });
});

describe('assetClassLabel', () => {
  it('labels known asset classes', () => {
    expect(assetClassLabel('crypto')).toBe('Crypto');
    expect(assetClassLabel('stocks')).toBe('Stock');
    expect(assetClassLabel('metals')).toBe('Metal');
    expect(assetClassLabel('forex')).toBe('Forex');
    expect(assetClassLabel('indices')).toBe('Index');
    expect(assetClassLabel('other')).toBe('other');
  });
});

describe('formatCompactMoney', () => {
  it('formats compact currency values', () => {
    expect(formatCompactMoney(1_500_000, 'USD')).toMatch(/\$1\.5/);
  });
});

describe('isWatchlisted', () => {
  it('only treats strict true as watchlisted', () => {
    expect(isWatchlisted(true)).toBe(true);
    expect(isWatchlisted(false)).toBe(false);
    expect(isWatchlisted(1)).toBe(false);
  });
});
