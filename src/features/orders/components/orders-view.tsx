"use client";

import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { OrdersSummary } from "@/features/orders/components/orders-summary";
import { OrderCard } from "@/features/orders/components/order-card";
import { RecentFills } from "@/features/orders/components/recent-fills";
import {
  openOrdersSeed,
  orderHistorySeed,
  recentFillsSeed,
  type Order,
} from "@/features/orders/data/orders";

type Tab = "open" | "history" | "trades";

export function OrdersView() {
  const [tab, setTab] = useState<Tab>("open");
  const [orders, setOrders] = useState<Order[]>(openOrdersSeed);
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const openOrders = useMemo(
    () =>
      orders.filter(
        (o) => o.status === "pending" || o.status === "partially_filled"
      ),
    [orders]
  );

  const pendingCount = openOrders.filter((o) => o.status === "pending").length;
  const partialCount = openOrders.filter(
    (o) => o.status === "partially_filled"
  ).length;

  const filteredOpen = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return openOrders;
    return openOrders.filter(
      (o) =>
        o.symbol.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q)
    );
  }, [openOrders, query]);

  const filteredHistory = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = [
      ...orderHistorySeed,
      ...orders.filter((o) => o.status === "cancelled" || o.status === "filled"),
    ];
    if (!q) return list;
    return list.filter(
      (o) =>
        o.symbol.toLowerCase().includes(q) ||
        o.name.toLowerCase().includes(q)
    );
  }, [orders, query]);

  function cancelOrder(id: string) {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === id ? { ...order, status: "cancelled" as const } : order
      )
    );
  }

  function cancelAll() {
    setOrders((prev) =>
      prev.map((order) =>
        order.status === "pending" || order.status === "partially_filled"
          ? { ...order, status: "cancelled" as const }
          : order
      )
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "open", label: `Open Orders (${openOrders.length})` },
    { id: "history", label: "Order History" },
    { id: "trades", label: "Trade History" },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Orders
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track and manage all your orders.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            aria-label="Search orders"
            onClick={() => setShowSearch((v) => !v)}
          >
            <Search />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="rounded-xl"
            aria-label="Filter orders"
          >
            <Filter />
          </Button>
        </div>
      </div>

      {showSearch && (
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders by asset..."
          className="h-10 rounded-xl bg-card"
        />
      )}

      <div className="scrollbar-none flex gap-2 overflow-x-auto overscroll-x-contain pb-0.5">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors",
              tab === item.id
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <OrdersSummary
        openCount={openOrders.length}
        pendingCount={pendingCount}
        partialCount={partialCount}
      />

      {tab === "open" && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Open Orders
            </h2>
            {openOrders.length > 0 && (
              <button
                type="button"
                onClick={cancelAll}
                className="text-sm font-medium text-primary hover:underline"
              >
                Cancel All
              </button>
            )}
          </div>

          {filteredOpen.length === 0 ? (
            <CardEmpty message="No open orders" />
          ) : (
            <div className="space-y-3">
              {filteredOpen.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancel={cancelOrder}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "history" && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-foreground">
            Order History
          </h2>
          {filteredHistory.length === 0 ? (
            <CardEmpty message="No order history" />
          ) : (
            <div className="space-y-3">
              {filteredHistory.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      )}

      {tab === "trades" && <RecentFills fills={recentFillsSeed} />}

      {tab === "open" && <RecentFills fills={recentFillsSeed} />}
    </div>
  );
}

function CardEmpty({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card px-4 py-10 text-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
