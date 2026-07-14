import { cn } from "@/lib/utils";
import {
  statusLabel,
  type OrderSide,
  type OrderStatus,
} from "@/features/orders/data/orders";

export function SideBadge({ side }: { side: OrderSide }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold",
        side === "buy"
          ? "bg-emerald-50 text-success dark:bg-emerald-950/40"
          : "bg-red-50 text-destructive dark:bg-red-950/40"
      )}
    >
      {side === "buy" ? "Buy" : "Sell"}
    </span>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
        status === "pending" &&
          "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
        status === "partially_filled" &&
          "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300",
        status === "filled" &&
          "bg-emerald-50 text-success dark:bg-emerald-950/40",
        status === "cancelled" &&
          "bg-muted text-muted-foreground"
      )}
    >
      {statusLabel(status)}
    </span>
  );
}

export function AssetIcon({
  symbol,
  iconBg,
  iconLabel,
}: {
  symbol: string;
  iconBg: string;
  iconLabel: string;
}) {
  if (symbol === "AAPL") {
    return (
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-full ${iconBg}`}
      >
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${iconBg}`}
    >
      {iconLabel}
    </div>
  );
}
