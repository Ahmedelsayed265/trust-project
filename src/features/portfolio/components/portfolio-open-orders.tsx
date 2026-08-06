"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatMoney, type ProviderOrder } from "@/shared/trading";
import {
  formatQty,
  formatRelativeTime,
} from "@/features/portfolio/lib/portfolio-data";

export function PortfolioOpenOrders({
  orders,
  currency,
  loading,
}: {
  orders: ProviderOrder[];
  currency: string;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Open orders</CardTitle>
        <Link
          href="/orders"
          className="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-primary hover:underline"
        >
          View all
          <ArrowRight className="size-3.5" />
        </Link>
      </CardHeader>

      <CardContent className="space-y-2.5">
        {loading ? (
          [0, 1].map((index) => <Skeleton key={index} className="h-16 w-full" />)
        ) : orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No working orders at the provider.
          </p>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between gap-3 rounded-[12px] border border-border px-3 py-2.5"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className={cn(
                      "border-0 uppercase",
                      order.side === "buy"
                        ? "bg-success/12 text-success"
                        : "bg-destructive/12 text-destructive"
                    )}
                  >
                    {order.side}
                  </Badge>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {order.symbol}
                  </p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.type === "limit" && order.limitPrice != null
                    ? `Limit ${formatMoney(order.limitPrice, currency)}`
                    : "Market"}{" "}
                  · {formatRelativeTime(order.createdAt)}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-semibold text-foreground">
                  {formatQty(order.qty)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatQty(order.filledQty)} filled
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
