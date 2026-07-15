"use client";

import { useFormContext } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  BTC_PRICE,
  estimateQuantity,
  formatQty,
  formatUsd,
  parseAmount,
  type OrderFormValues,
} from "@/features/trades/schemas/order";

export function OrderSummary() {
  const form = useFormContext<OrderFormValues>();
  const values = form.watch();
  const amount = parseAmount(values.amount);
  const qty = estimateQuantity(values.amount);
  const total = amount;

  const rows = [
    { label: "Pair", value: values.pair },
    {
      label: "Order Type",
      value: values.orderType === "market" ? "Market" : "Limit",
    },
    {
      label: "Side",
      value: values.side.toUpperCase(),
      className:
        values.side === "buy" ? "text-success" : "text-destructive",
    },
    {
      label: "Amount",
      value: `${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })} ${values.currency}`,
    },
    { label: "Est. Quantity", value: `${formatQty(qty)} BTC` },
    {
      label: "Est. Price",
      value: formatUsd(BTC_PRICE),
    },
    {
      label: "Est. Total",
      value: formatUsd(total),
      bold: true,
    },
  ];

  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 pt-0">
        {rows.map((row, index) => (
          <div key={row.label}>
            {index === rows.length - 1 && <Separator className="my-2" />}
            <div className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span
                className={cn(
                  "font-medium text-foreground",
                  row.bold && "text-base font-bold",
                  row.className
                )}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
