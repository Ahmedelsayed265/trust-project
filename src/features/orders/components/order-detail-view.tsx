'use client';

import Link from 'next/link';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CancelOrderButton } from '@/features/orders/components/cancel-order-button';
import {
  AssetIcon,
  SideBadge,
  StatusBadge,
} from '@/features/orders/components/order-badges';
import {
  formatOrderDate,
  formatOrderPrice,
  formatOrderQty,
  orderDisplayPrice,
} from '@/features/orders/lib/order-display';
import type { Order } from '@/features/orders/types';
import { formatMoney } from '@/shared/trading';

export function OrderDetailView({ order }: { order: Order }) {
  const stats = [
    { label: 'Quantity', value: formatOrderQty(order.qty) },
    { label: 'Filled', value: formatOrderQty(order.filled_qty) },
    { label: 'Remaining', value: formatOrderQty(order.remaining_qty) },
    {
      label: 'Limit price',
      value: formatOrderPrice(order.limit_price),
    },
    {
      label: 'Avg fill',
      value: formatOrderPrice(order.avg_fill_price),
    },
    {
      label: order.is_open ? 'Est. total' : 'Total',
      value: formatMoney(order.quote_amount),
    },
    {
      label: 'Fee',
      value:
        order.fee > 0 ? `${formatMoney(order.fee)} ${order.fee_asset}` : '—',
    },
    { label: 'Type', value: order.type },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mb-2 -ml-2 h-8 gap-1.5 px-2"
          render={<Link href="/orders" />}
        >
          <ArrowLeft className="size-3.5" />
          Back to orders
        </Button>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            {order.display_symbol || order.symbol}
          </h1>
          <SideBadge side={order.side} />
          <StatusBadge status={order.status} />
        </div>
        <nav
          className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-1 text-sm"
          aria-label="Breadcrumb"
        >
          <Link href="/orders" className="hover:text-foreground">
            Orders
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">#{order.id}</span>
        </nav>
      </div>

      <Card>
        <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
          <div className="flex items-center gap-3">
            <AssetIcon
              symbol={order.symbol}
              displaySymbol={order.display_symbol}
            />
            <div>
              <CardTitle className="text-lg">
                {order.display_symbol || order.symbol}
              </CardTitle>
              <p className="text-muted-foreground mt-0.5 text-sm">
                {order.account} · {order.provider_id}
              </p>
            </div>
          </div>
          <p className="text-foreground text-right text-xl font-bold tracking-tight">
            {orderDisplayPrice(order)}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="border-border bg-muted/30 rounded-xl border px-3 py-2.5"
              >
                <p className="text-muted-foreground text-xs">{stat.label}</p>
                <p className="text-foreground mt-1 text-sm font-semibold capitalize">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="text-muted-foreground grid gap-2 text-sm sm:grid-cols-2">
            <p>
              Created{' '}
              <span className="text-foreground font-medium">
                {formatOrderDate(order.created_at)}
              </span>
            </p>
            <p>
              Updated{' '}
              <span className="text-foreground font-medium">
                {formatOrderDate(order.updated_at)}
              </span>
            </p>
            {order.client_order_id ? (
              <p className="sm:col-span-2">
                Client order id{' '}
                <span className="text-foreground font-medium">
                  {order.client_order_id}
                </span>
              </p>
            ) : null}
            {order.reject_reason ? (
              <p className="text-destructive sm:col-span-2">
                Reject reason: {order.reject_reason}
              </p>
            ) : null}
          </div>

          {order.is_open ? (
            <div className="flex sm:justify-end">
              <CancelOrderButton
                orderId={order.id}
                providerId={order.provider_id}
                symbol={order.display_symbol || order.symbol}
                redirectToOrders
              />
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
