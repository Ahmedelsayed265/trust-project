"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { Sparkline } from "@/shared/components/sparkline";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { routes } from "@/shared/lib/routes";

const seed = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    price: "$67,432.10",
    change: "+2.45%",
    positive: true,
    data: [30, 35, 32, 40, 48, 52, 58],
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    price: "$3,456.78",
    change: "+1.82%",
    positive: true,
    data: [28, 32, 30, 36, 40, 44, 48],
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$178.25",
    change: "+1.30%",
    positive: true,
    data: [40, 42, 41, 45, 44, 48, 50],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: "$248.50",
    change: "-1.28%",
    positive: false,
    data: [60, 55, 52, 48, 45, 42, 40],
  },
  {
    symbol: "XAU/USD",
    name: "Gold",
    price: "$2,345.80",
    change: "+0.68%",
    positive: true,
    data: [42, 44, 43, 46, 47, 48, 50],
  },
];

export function WatchlistView() {
  const [items, setItems] = useState(seed);

  function remove(symbol: string) {
    setItems((prev) => prev.filter((item) => item.symbol !== symbol));
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Watchlist"
        description="Assets you follow across markets."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href={routes.markets} />}
          >
            Browse Markets
          </Button>
        }
      />

      <Card className="">
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="px-5 py-10 text-center text-sm text-muted-foreground">
              Your watchlist is empty.
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li
                  key={item.symbol}
                  className="flex items-center gap-3 px-4 py-3.5 sm:px-5"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.symbol}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.name}</p>
                  </div>
                  <Sparkline
                    data={item.data}
                    positive={item.positive}
                    className="hidden h-8 w-20 sm:block"
                  />
                  <div className="min-w-[88px] text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {item.price}
                    </p>
                    <ChangeIndicator
                      value={item.change}
                      positive={item.positive}
                      className="text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(item.symbol)}
                    className={cn("text-primary transition-colors hover:opacity-80")}
                    aria-label={`Remove ${item.symbol}`}
                  >
                    <Star className="size-4" fill="currentColor" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
