import { describe, expect, it } from 'vitest';
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
} from '@/shared/trading/format';

describe('formatMoney', () => {
  it('formats USD values', () => {
    expect(formatMoney(1234.5, 'USD')).toBe('$1,234.50');
  });

  it('treats USDT as USD', () => {
    expect(formatMoney(100, 'USDT')).toBe('$100.00');
  });
});

describe('formatSignedMoney', () => {
  it('prefixes positive values with +', () => {
    expect(formatSignedMoney(25, 'USD')).toBe('+$25.00');
  });

  it('prefixes negative values with -', () => {
    expect(formatSignedMoney(-25, 'USD')).toBe('-$25.00');
  });
});

describe('formatPct', () => {
  it('formats positive percentages with a + sign', () => {
    expect(formatPct(1.25)).toBe('+1.25%');
  });

  it('formats negative percentages without a + sign', () => {
    expect(formatPct(-2.5)).toBe('-2.50%');
  });
});
