import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AssetIcon,
  SideBadge,
  StatusBadge,
} from "@/features/orders/components/order-badges";
import type { Fill } from "@/features/orders/data/orders";

export function RecentFills({ fills }: { fills: Fill[] }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Recent Fills</CardTitle>
        <CardAction>
          <button
            type="button"
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="hidden grid-cols-[1.4fr_0.7fr_1fr_1fr_0.8fr_1fr] gap-3 border-b border-border px-1 pb-2 text-xs font-medium text-muted-foreground md:grid">
          <span>Asset</span>
          <span>Side</span>
          <span>Amount</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Time</span>
        </div>

        {fills.map((fill) => (
          <div
            key={fill.id}
            className="flex flex-col gap-2 rounded-xl px-1 py-3 transition-colors hover:bg-muted/40 md:grid md:grid-cols-[1.4fr_0.7fr_1fr_1fr_0.8fr_1fr] md:items-center md:gap-3"
          >
            <div className="flex items-center gap-2.5">
              <AssetIcon
                symbol={fill.symbol}
                iconBg={fill.iconBg}
                iconLabel={fill.iconLabel}
              />
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {fill.symbol}
                </p>
                <p className="text-xs text-muted-foreground md:hidden">
                  {fill.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-xs text-muted-foreground md:hidden">
                Side
              </span>
              <SideBadge side={fill.side} />
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-xs text-muted-foreground md:hidden">
                Amount
              </span>
              <p className="text-sm font-medium text-foreground">{fill.amount}</p>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-xs text-muted-foreground md:hidden">
                Price
              </span>
              <p className="text-sm font-medium text-foreground">{fill.price}</p>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-xs text-muted-foreground md:hidden">
                Status
              </span>
              <StatusBadge status={fill.status} />
            </div>

            <div className="flex items-center justify-between md:justify-end">
              <span className="text-xs text-muted-foreground md:hidden">
                Time
              </span>
              <p className="text-xs text-muted-foreground md:text-sm">
                {fill.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
