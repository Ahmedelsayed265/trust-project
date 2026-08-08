import { describe, expect, it } from 'vitest';
import { orderSchema, parseAmount } from '@/features/trades/schemas/order';

describe('parseAmount', () => {
  it('parses plain and comma-formatted numbers', () => {
    expect(parseAmount('1,250.5')).toBe(1250.5);
    expect(parseAmount('0')).toBe(0);
    expect(parseAmount('abc')).toBe(0);
  });
});

describe('orderSchema', () => {
  const base = {
    pair: 'BTCUSDT',
    orderType: 'market' as const,
    side: 'buy' as const,
    amount: '0.01',
    currency: 'USDT',
    percent: 25,
  };

  it('accepts a market order without limit price', () => {
    expect(orderSchema.safeParse(base).success).toBe(true);
  });

  it('accepts base-asset currency amounts', () => {
    expect(
      orderSchema.safeParse({ ...base, currency: 'BTC', amount: '0.01' })
        .success,
    ).toBe(true);
  });

  it('requires a positive amount', () => {
    expect(orderSchema.safeParse({ ...base, amount: '0' }).success).toBe(false);
    expect(orderSchema.safeParse({ ...base, amount: '-1' }).success).toBe(
      false,
    );
  });

  it('requires a valid limit price for limit orders', () => {
    expect(
      orderSchema.safeParse({
        ...base,
        orderType: 'limit',
        limitPrice: '',
      }).success,
    ).toBe(false);

    expect(
      orderSchema.safeParse({
        ...base,
        orderType: 'limit',
        limitPrice: '68,000',
      }).success,
    ).toBe(true);
  });

  it('clamps percent between 0 and 100', () => {
    expect(orderSchema.safeParse({ ...base, percent: -1 }).success).toBe(false);
    expect(orderSchema.safeParse({ ...base, percent: 101 }).success).toBe(
      false,
    );
  });
});
