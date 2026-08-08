'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
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
import { cn } from '@/lib/utils';
import { formatMoney } from '@/shared/trading';

function orderHref(order: Order) {
  const params = new URLSearchParams();
  if (order.provider_id) params.set('provider_id', order.provider_id);
  const query = params.toString();
  return `/orders/${encodeURIComponent(order.id)}${query ? `?${query}` : ''}`;
}

function Stat({
  label,
  value,
  className,
  emphasis,
}: {
  label: string;
  value: string;
  className?: string;
  emphasis?: boolean;
}) {
  return (
    <div className={cn('min-w-0 sm:text-right', className)}>
      <dt className="text-muted-foreground text-[11px] leading-tight">
        {label}
      </dt>
      <dd
        className={cn(
          'truncate text-sm font-semibold tabular-nums',
          emphasis ? 'text-foreground' : 'text-foreground/85',
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function OrderCard({
  order,
  onCancelled,
}: {
  order: Order;
  onCancelled?: (orderId: string) => void;
}) {
  const symbol = order.display_symbol || order.symbol;
  const filledPct =
    order.qty > 0 ? Math.min((order.filled_qty / order.qty) * 100, 100) : 0;
  const partiallyFilled = order.filled_qty > 0 && filledPct < 100;

  const meta = [
    order.type.charAt(0).toUpperCase() + order.type.slice(1),
    order.account,
    formatOrderDate(order.created_at),
    partiallyFilled
      ? `${formatOrderQty(order.filled_qty)} of ${formatOrderQty(order.qty)} filled`
      : null,
    order.fee > 0 ? `Fee ${formatMoney(order.fee)} ${order.fee_asset}` : null,
  ].filter(Boolean) as string[];

  return (
    <Card className="hover:border-border/70 hover:bg-muted/25 relative gap-0 py-0 transition-colors">
      <Link
        href={orderHref(order)}
        aria-label={`${order.side} ${symbol} order`}
        className="focus-visible:ring-ring absolute inset-0 rounded-[inherit] focus-visible:ring-2 focus-visible:outline-none"
      />

      <div className="pointer-events-none relative flex flex-col gap-3 p-3.5 sm:flex-row sm:items-center sm:gap-5 sm:p-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <span
            aria-hidden
            className={cn(
              'h-10 w-1 shrink-0 rounded-full',
              order.side === 'buy' ? 'bg-success' : 'bg-destructive',
            )}
          />
          <AssetIcon
            symbol={order.symbol}
            displaySymbol={order.display_symbol}
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <p className="text-foreground truncate text-sm font-semibold">
                {symbol}
              </p>
              <SideBadge side={order.side} />
              <StatusBadge status={order.status} />
            </div>
            <p className="text-muted-foreground mt-0.5 text-xs">
              {meta.join(' · ')}
            </p>
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-3 sm:flex sm:shrink-0 sm:items-center sm:gap-6">
          <Stat
            label="Amount"
            value={formatOrderQty(order.qty)}
            className="sm:w-24"
          />
          <Stat
            label="Price"
            value={orderDisplayPrice(order)}
            className="sm:w-28"
          />
          <Stat
            label={order.is_open ? 'Est. total' : 'Total'}
            value={formatMoney(order.quote_amount)}
            className="sm:w-28"
            emphasis
          />
        </dl>

        {order.is_open ? (
          <div className="pointer-events-auto sm:shrink-0">
            <CancelOrderButton
              orderId={order.id}
              providerId={order.provider_id}
              symbol={symbol}
              label="Cancel"
              onCancelled={onCancelled}
              className="h-9 rounded-lg px-3 text-xs"
            />
          </div>
        ) : null}
      </div>

      {partiallyFilled ? (
        <div className="bg-muted relative h-0.5 w-full">
          <div
            className="bg-primary h-full rounded-r-full transition-[width]"
            style={{ width: `${filledPct}%` }}
          />
        </div>
      ) : null}
    </Card>
  );
}
