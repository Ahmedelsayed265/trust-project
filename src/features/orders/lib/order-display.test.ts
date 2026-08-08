import { describe, expect, it } from 'vitest';
import {
  formatOrderDate,
  formatOrderPrice,
  formatOrderQty,
  isCanceledStatus,
  orderAssetLabel,
  orderDisplayPrice,
  statusLabel,
} from '@/features/orders/lib/order-display';
import type { Order } from '@/features/orders/types';

function makeOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: '1',
    client_order_id: null,
    symbol: 'BTCUSDT',
    display_symbol: 'BTC/USDT',
    side: 'buy',
    type: 'limit',
    qty: 0.1,
    filled_qty: 0,
    remaining_qty: 0.1,
    limit_price: 68000,
    avg_fill_price: null,
    quote_amount: 6800,
    status: 'new',
    is_open: true,
    reject_reason: null,
    fee: 0,
    fee_asset: 'USDT',
    created_at: '2026-01-01T12:00:00.000Z',
    updated_at: '2026-01-01T12:00:00.000Z',
    provider_id: 'binance-spot',
    account: 'Binance Spot',
    ...overrides,
  };
}

describe('statusLabel', () => {
  it('maps known statuses', () => {
    expect(statusLabel('new')).toBe('Open');
    expect(statusLabel('partially_filled')).toBe('Partially Filled');
    expect(statusLabel('filled')).toBe('Filled');
    expect(statusLabel('canceled')).toBe('Canceled');
    expect(statusLabel('cancelled')).toBe('Canceled');
    expect(statusLabel('rejected')).toBe('Rejected');
  });

  it('title-cases unknown statuses', () => {
    expect(statusLabel('pending_new')).toBe('Pending New');
  });
});

describe('isCanceledStatus', () => {
  it('treats canceled and cancelled as canceled', () => {
    expect(isCanceledStatus('canceled')).toBe(true);
    expect(isCanceledStatus('cancelled')).toBe(true);
    expect(isCanceledStatus('filled')).toBe(false);
  });
});

describe('format helpers', () => {
  it('formats null price as Market', () => {
    expect(formatOrderPrice(null)).toBe('Market');
  });

  it('formats qty with up to 8 fraction digits', () => {
    expect(formatOrderQty(0.123456789)).toBe('0.12345679');
  });

  it('returns original string for invalid dates', () => {
    expect(formatOrderDate('not-a-date')).toBe('not-a-date');
  });
});

describe('orderDisplayPrice', () => {
  it('prefers average fill price over limit price', () => {
    expect(
      orderDisplayPrice(
        makeOrder({ avg_fill_price: 69000, limit_price: 68000 }),
      ),
    ).toBe(formatOrderPrice(69000));
  });

  it('falls back to limit price', () => {
    expect(orderDisplayPrice(makeOrder({ avg_fill_price: null }))).toBe(
      formatOrderPrice(68000),
    );
  });
});

describe('orderAssetLabel', () => {
  it('uses the first two characters of the base asset', () => {
    expect(orderAssetLabel('BTC/USDT')).toBe('BT');
    expect(orderAssetLabel('ETH')).toBe('ET');
  });
});
