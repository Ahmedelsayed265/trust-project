import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useOrders } from '@/features/orders/hooks/use-orders';
import type { Order, OrderFill, OrdersData } from '@/features/orders/types';

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

const initialData: OrdersData = {
  items: [
    makeOrder({
      id: 'open-1',
      is_open: true,
      status: 'new',
      quote_amount: 100,
    }),
    makeOrder({
      id: 'filled-1',
      is_open: false,
      status: 'filled',
      symbol: 'ETHUSDT',
      display_symbol: 'ETH/USDT',
      quote_amount: 50,
    }),
  ],
  summary: {
    total: 2,
    open: 1,
    filled: 1,
    canceled: 0,
    open_value: 100,
  },
};

const fills: OrderFill[] = [
  {
    id: 'f1',
    order_id: 'filled-1',
    symbol: 'ETHUSDT',
    display_symbol: 'ETH/USDT',
    side: 'buy',
    qty: 1,
    price: 3000,
    notional: 3000,
    fee: 1,
    fee_asset: 'USDT',
    created_at: '2026-01-01T12:00:00.000Z',
    provider_id: 'binance-spot',
    account: 'Binance Spot',
  },
];

describe('useOrders', () => {
  it('splits open and history orders', () => {
    const { result } = renderHook(() => useOrders(initialData, fills));
    expect(result.current.openOrders).toHaveLength(1);
    expect(result.current.historyOrders).toHaveLength(1);
    expect(result.current.fills).toHaveLength(1);
  });

  it('filters by query across symbol and account', () => {
    const { result } = renderHook(() => useOrders(initialData, fills));

    act(() => {
      result.current.setQuery('eth');
    });

    expect(result.current.openOrders).toHaveLength(0);
    expect(result.current.historyOrders.map((order) => order.id)).toEqual([
      'filled-1',
    ]);
    expect(result.current.fills).toHaveLength(1);
  });

  it('updates summary when an order is cancelled', () => {
    const { result } = renderHook(() => useOrders(initialData, fills));

    act(() => {
      result.current.markCancelled('open-1');
    });

    expect(result.current.openOrders).toHaveLength(0);
    expect(result.current.data.summary).toMatchObject({
      open: 0,
      canceled: 1,
      filled: 1,
      open_value: 0,
      total: 2,
    });
  });
});
