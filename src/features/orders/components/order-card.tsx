'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  AssetIcon,
  SideBadge,
  StatusBadge,
} from '@/features/orders/components/order-badges';
import type { Order } from '@/features/orders/data/orders';

export function OrderCard({
  order,
  onCancel,
}: {
  order: Order;
  onCancel?: (id: string) => void;
}) {
  const canCancel =
    order.status === 'pending' || order.status === 'partially_filled';

  const details = [
    { label: 'Order Type', value: order.orderType },
    { label: 'Amount', value: order.amount },
    ...(order.filled ? [{ label: 'Filled', value: order.filled }] : []),
    { label: 'Price', value: order.price },
    { label: order.totalLabel ?? 'Total', value: order.total },
  ];

  return (
    <Card className="">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <AssetIcon
              symbol={order.symbol}
              iconBg={order.iconBg}
              iconLabel={order.iconLabel}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-foreground text-sm font-semibold">
                  {order.symbol}
                </p>
                <SideBadge side={order.side} />
              </div>
              <p className="text-muted-foreground text-xs">{order.name}</p>
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

        {canCancel && (
          <div className="flex sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive h-10 w-full rounded-xl sm:w-auto"
              onClick={() => onCancel?.(order.id)}
            >
              Cancel Order
            </Button>
          </div>
        )}

        {order.createdAt && (
          <p className="text-muted-foreground text-xs">{order.createdAt}</p>
        )}
      </CardContent>
    </Card>
  );
}
