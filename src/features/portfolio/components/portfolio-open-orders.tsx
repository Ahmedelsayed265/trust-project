import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/shared/trading';
import type { Order } from '@/features/orders/types';
import {
  formatQty,
  formatRelativeTime,
} from '@/features/portfolio/lib/portfolio-data';

export function PortfolioOpenOrders({
  orders,
  currency,
}: {
  orders: Order[];
  currency: string;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Open orders</CardTitle>
        <Link
          href="/orders"
          className="text-primary inline-flex shrink-0 items-center gap-1 text-xs font-medium hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {orders.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            No working orders at the provider.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border-border flex items-center justify-between gap-3 rounded-[12px] border px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      'border-0 uppercase',
                      order.side === 'buy'
                        ? 'bg-success/12 text-success'
                        : 'bg-destructive/12 text-destructive',
                    )}
                  >
                    {order.side}
                  </Badge>
                  <p className="text-foreground truncate text-sm font-semibold">
                    {order.display_symbol || order.symbol}
                  </p>
                </div>
                <p className="text-muted-foreground mt-1 text-xs">
                  {order.type === 'limit' && order.limit_price != null
                    ? `Limit ${formatMoney(order.limit_price, currency)}`
                    : 'Market'}{' '}
                  · {formatRelativeTime(order.created_at)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-foreground text-sm font-semibold">
                  {formatQty(order.qty)}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatQty(order.filled_qty)} filled
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
