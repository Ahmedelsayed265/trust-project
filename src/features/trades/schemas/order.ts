import { z } from "zod";

export const orderSchema = z.object({
  pair: z.string().min(1),
  orderType: z.enum(["market", "limit"]),
  side: z.enum(["buy", "sell"]),
  amount: z
    .string()
    .min(1, "Amount is required")
    .refine((v) => !Number.isNaN(Number(v.replace(/,/g, ""))) && Number(v.replace(/,/g, "")) > 0, {
      message: "Enter a valid amount",
    }),
  currency: z.enum(["USDT", "BTC"]),
  limitPrice: z.string().optional(),
  percent: z.number().min(0).max(100),
});

export type OrderFormValues = z.infer<typeof orderSchema>;

export const BTC_PRICE = 67432.1;

export function parseAmount(value: string) {
  return Number(value.replace(/,/g, "")) || 0;
}

export function estimateQuantity(amount: string, price = BTC_PRICE) {
  const amt = parseAmount(amount);
  if (!price) return 0;
  return amt / price;
}

export function formatQty(qty: number) {
  return qty.toFixed(5);
}

export function formatUsd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}
