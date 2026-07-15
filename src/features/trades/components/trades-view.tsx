"use client";

import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { History, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  orderSchema,
  type OrderFormValues,
} from "@/features/trades/schemas/order";
import { AccountSummary } from "@/features/trades/components/account-summary";
import { OrderEntry } from "@/features/trades/components/order-entry";
import { OrderSummary } from "@/features/trades/components/order-summary";
import { TradeAiSignal } from "@/features/trades/components/trade-ai-signal";
import { OpenPositions } from "@/features/trades/components/open-positions";

export function TradesView() {
  const [tab, setTab] = useState<"trade" | "positions">("trade");
  const [reviewed, setReviewed] = useState(false);

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      pair: "BTC/USDT",
      orderType: "market",
      side: "buy",
      amount: "1000",
      currency: "USDT",
      percent: 0,
      limitPrice: "",
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Trades
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Place new trades and manage your positions.
          </p>
        </div>
        <Button variant="outline" className="w-full rounded-xl sm:w-auto">
          <History />
          Trade History
        </Button>
      </div>

      <AccountSummary />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-1 rounded-xl bg-muted p-1">
          {(["trade", "positions"] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                "rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors",
                tab === item
                  ? "bg-card text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl">
            All Accounts
            <ChevronDown />
          </Button>
          <Button size="icon" className="rounded-xl" aria-label="New trade">
            <Plus />
          </Button>
        </div>
      </div>

      <FormProvider {...form}>
        {tab === "trade" ? (
          <div className="grid gap-4 xl:grid-cols-3 lg:gap-5">
            <OrderEntry
              onReview={() => {
                setReviewed(true);
                window.setTimeout(() => setReviewed(false), 2500);
              }}
            />
            <div className="flex flex-col gap-4">
              <OrderSummary />
              <TradeAiSignal />
              {reviewed && (
                <p className="rounded-xl border border-success/30 bg-emerald-50 px-3 py-2 text-sm font-medium text-success dark:bg-emerald-950/30">
                  Order ready for review — estimated total updated.
                </p>
              )}
            </div>
            <OpenPositions />
          </div>
        ) : (
          <div className="mx-auto w-full max-w-xl">
            <OpenPositions />
          </div>
        )}
      </FormProvider>
    </div>
  );
}
