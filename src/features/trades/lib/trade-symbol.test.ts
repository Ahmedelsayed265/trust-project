import { describe, expect, it } from 'vitest';
import {
  isQuoteAmountCurrency,
  normalizeTradeSymbol,
} from '@/features/trades/lib/trade-symbol';

describe('normalizeTradeSymbol', () => {
  it('uppercases and strips slashes', () => {
    expect(normalizeTradeSymbol(' btc/usdt ')).toBe('BTCUSDT');
    expect(normalizeTradeSymbol('ETHUSDT')).toBe('ETHUSDT');
  });
});

describe('isQuoteAmountCurrency', () => {
  it('treats matching quote assets as quote-amount mode', () => {
    expect(isQuoteAmountCurrency('USDT', 'USDT')).toBe(true);
    expect(isQuoteAmountCurrency('btc', 'USDT')).toBe(false);
    expect(isQuoteAmountCurrency('USD', null)).toBe(true);
  });
});
