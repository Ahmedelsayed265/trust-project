"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  AssetIcon,
  SideBadge,
  StatusBadge,
} from "@/features/orders/components/order-badges";
import type { Order } from "@/features/orders/data/orders";

export function OrderCard({
  order,
  onCancel,
}: {
  order: Order;
  onCancel?: (id: string) => void;
}) {
  const canCancel =
    order.status === "pending" || order.status === "partially_filled";

  const details = [
    { label: "Order Type", value: order.orderType },
    { label: "Amount", value: order.amount },
    ...(order.filled
      ? [{ label: "Filled", value: order.filled }]
      : []),
    { label: "Price", value: order.price },
    { label: order.totalLabel ?? "Total", value: order.total },
  ];

  return (
    <Card className="shadow-sm">
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
                <p className="text-sm font-semibold text-foreground">
                  {order.symbol}
                </p>
                <SideBadge side={order.side} />
              </div>
              <p className="text-xs text-muted-foreground">{order.name}</p>
            </div>
          </div>
          <StatusBadge status={order.status} />
        </div>

        <div
          className={`grid gap-3 text-sm ${
            details.length > 4
              ? "grid-cols-2 sm:grid-cols-5"
              : "grid-cols-2 sm:grid-cols-4"
          }`}
        >
          {details.map((detail) => (
            <div key={detail.label}>
              <p className="text-xs text-muted-foreground">{detail.label}</p>
              <p className="font-semibold capitalize text-foreground">
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
              className="h-10 w-full rounded-xl border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive sm:w-auto"
              onClick={() => onCancel?.(order.id)}
            >
              Cancel Order
            </Button>
          </div>
        )}

        {order.createdAt && (
          <p className="text-xs text-muted-foreground">{order.createdAt}</p>
        )}
      </CardContent>
    </Card>
  );
}
