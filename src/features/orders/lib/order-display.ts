import type { Order, OrderStatus } from '@/features/orders/types';
import { formatMoney } from '@/shared/trading';

export function statusLabel(status: OrderStatus) {
  const normalized = String(status).toLowerCase();

  switch (normalized) {
    case 'new':
      return 'Open';
    case 'partially_filled':
      return 'Partially Filled';
    case 'filled':
      return 'Filled';
    case 'canceled':
    case 'cancelled':
      return 'Canceled';
    case 'rejected':
      return 'Rejected';
    default:
      return status
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

export function isCanceledStatus(status: OrderStatus) {
  const normalized = String(status).toLowerCase();
  return normalized === 'canceled' || normalized === 'cancelled';
}

export function formatOrderPrice(value: number | null | undefined) {
  if (value == null) return 'Market';
  return formatMoney(value);
}

export function formatOrderQty(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 8,
  }).format(value);
}

export function formatOrderDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function orderDisplayPrice(order: Order) {
  if (order.avg_fill_price != null)
    return formatOrderPrice(order.avg_fill_price);
  return formatOrderPrice(order.limit_price);
}

export function orderAssetLabel(symbol: string) {
  const base = symbol.split('/')[0] || symbol;
  return base.slice(0, 2).toUpperCase();
}
