'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { CancelOrderButton } from '@/features/orders/components/cancel-order-button';
import {
  AssetIcon,
  SideBadge,
  StatusBadge,
} from '@/features/orders/components/order-badges';
import {
  formatOrderDate,
  formatOrderQty,
  orderDisplayPrice,
} from '@/features/orders/lib/order-display';
import type { Order } from '@/features/orders/types';
import { formatMoney } from '@/shared/trading';

function orderHref(order: Order) {
  const params = new URLSearchParams();
  if (order.provider_id) params.set('provider_id', order.provider_id);
  const query = params.toString();
  return `/orders/${encodeURIComponent(order.id)}${query ? `?${query}` : ''}`;
}

export function OrderCard({
  order,
  onCancelled,
}: {
  order: Order;
  onCancelled?: (orderId: string) => void;
}) {
  const details = [
    { label: 'Order Type', value: order.type },
    { label: 'Amount', value: formatOrderQty(order.qty) },
    ...(order.filled_qty > 0
      ? [
          {
            label: 'Filled',
            value: `${formatOrderQty(order.filled_qty)} / ${formatOrderQty(order.qty)}`,
          },
        ]
      : []),
    { label: 'Price', value: orderDisplayPrice(order) },
    {
      label: order.is_open ? 'Est. Total' : 'Total',
      value: formatMoney(order.quote_amount),
    },
  ];

  return (
    <Card className="hover:bg-card/80 transition-colors">
      <CardContent className="space-y-4">
        <Link href={orderHref(order)} className="block space-y-4 outline-none">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <AssetIcon
                symbol={order.symbol}
                displaySymbol={order.display_symbol}
              />
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-foreground text-sm font-semibold">
                    {order.display_symbol || order.symbol}
                  </p>
                  <SideBadge side={order.side} />
                </div>
                <p className="text-muted-foreground text-xs">{order.account}</p>
              </div>
            </div>
            <StatusBadge status={order.status} />
          </div>

          <div
            className={`grid gap-3 text-sm ${
              details.length > 4
                ? 'grid-cols-2 sm:grid-cols-5'
                : 'grid-cols-2 sm:grid-cols-4'
            }`}
          >
            {details.map((detail) => (
              <div key={detail.label}>
                <p className="text-muted-foreground text-xs">{detail.label}</p>
                <p className="text-foreground font-semibold capitalize">
                  {detail.value}
                </p>
              </div>
            ))}
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center justify-between gap-2 text-xs">
            <span>{formatOrderDate(order.created_at)}</span>
            {order.fee > 0 ? (
              <span>
                Fee {formatMoney(order.fee)} {order.fee_asset}
              </span>
            ) : null}
          </div>
        </Link>

        {order.is_open ? (
          <div className="flex sm:justify-end">
            <CancelOrderButton
              orderId={order.id}
              providerId={order.provider_id}
              symbol={order.display_symbol || order.symbol}
              onCancelled={onCancelled}
            />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
