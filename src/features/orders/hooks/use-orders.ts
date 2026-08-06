'use client';

import { useMemo, useState } from 'react';
import type { Order, OrderFill, OrdersData } from '@/features/orders/types';

function matchesOrderQuery(order: Order, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    order.symbol.toLowerCase().includes(q) ||
    order.display_symbol.toLowerCase().includes(q) ||
    order.account.toLowerCase().includes(q)
  );
}

function matchesFillQuery(fill: OrderFill, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    fill.symbol.toLowerCase().includes(q) ||
    fill.display_symbol.toLowerCase().includes(q) ||
    fill.account.toLowerCase().includes(q)
  );
}

export function useOrders(initialData: OrdersData, initialFills: OrderFill[]) {
  const [data, setData] = useState(initialData);
  const [fills] = useState(initialFills);
  const [query, setQuery] = useState('');

  function markCancelled(orderId: string) {
    setData((current) => {
      const items = current.items.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: 'canceled',
              is_open: false,
              remaining_qty: 0,
            }
          : order,
      );

      const open = items.filter((order) => order.is_open).length;
      const canceled = items.filter(
        (order) => String(order.status).toLowerCase() === 'canceled',
      ).length;
      const filled = items.filter(
        (order) => String(order.status).toLowerCase() === 'filled',
      ).length;
      const openValue = items
        .filter((order) => order.is_open)
        .reduce((sum, order) => sum + order.quote_amount, 0);

      return {
        items,
        summary: {
          ...current.summary,
          open,
          canceled,
          filled,
          open_value: openValue,
          total: items.length,
        },
      };
    });
  }

  const openOrders = useMemo(
    () =>
      data.items.filter(
        (order) => order.is_open && matchesOrderQuery(order, query),
      ),
    [data.items, query],
  );

  const historyOrders = useMemo(
    () =>
      data.items.filter(
        (order) => !order.is_open && matchesOrderQuery(order, query),
      ),
    [data.items, query],
  );

  const filteredFills = useMemo(
    () => fills.filter((fill) => matchesFillQuery(fill, query)),
    [fills, query],
  );

  return {
    data,
    query,
    setQuery,
    openOrders,
    historyOrders,
    fills: filteredFills,
    markCancelled,
  };
}
