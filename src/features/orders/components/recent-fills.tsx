import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AssetIcon,
  SideBadge,
  StatusBadge,
} from '@/features/orders/components/order-badges';
import type { Fill } from '@/features/orders/data/orders';

export function RecentFills({ fills }: { fills: Fill[] }) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Recent Fills</CardTitle>
        <CardAction>
          <button
            type="button"
            className="text-primary text-sm font-medium hover:underline"
          >
            View All
          </button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="border-border text-muted-foreground hidden grid-cols-[1.4fr_0.7fr_1fr_1fr_0.8fr_1fr] gap-3 border-b px-1 pb-2 text-xs font-medium md:grid">
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
            className="hover:bg-muted/40 flex flex-col gap-2 rounded-xl px-1 py-3 transition-colors md:grid md:grid-cols-[1.4fr_0.7fr_1fr_1fr_0.8fr_1fr] md:items-center md:gap-3"
          >
            <div className="flex items-center gap-2.5">
              <AssetIcon
                symbol={fill.symbol}
                iconBg={fill.iconBg}
                iconLabel={fill.iconLabel}
              />
              <div>
                <p className="text-foreground text-sm font-semibold">
                  {fill.symbol}
                </p>
                <p className="text-muted-foreground text-xs md:hidden">
                  {fill.name}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-muted-foreground text-xs md:hidden">
                Side
              </span>
              <SideBadge side={fill.side} />
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-muted-foreground text-xs md:hidden">
                Amount
              </span>
              <p className="text-foreground text-sm font-medium">
                {fill.amount}
              </p>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-muted-foreground text-xs md:hidden">
                Price
              </span>
              <p className="text-foreground text-sm font-medium">
                {fill.price}
              </p>
            </div>

            <div className="flex items-center justify-between md:block">
              <span className="text-muted-foreground text-xs md:hidden">
                Status
              </span>
              <StatusBadge status={fill.status} />
            </div>

            <div className="flex items-center justify-between md:justify-end">
              <span className="text-muted-foreground text-xs md:hidden">
                Time
              </span>
              <p className="text-muted-foreground text-xs md:text-sm">
                {fill.time}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
