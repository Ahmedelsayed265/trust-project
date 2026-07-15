import Link from "next/link";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import { openPositions } from "@/features/trades/data/positions";
import { routes } from "@/shared/lib/routes";

export function OpenPositions() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Open Positions ({openPositions.length})</CardTitle>
        <CardAction>
          <Link
            href={routes.trades}
            className="text-sm font-medium text-primary hover:underline"
          >
            View All
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {openPositions.map((position) => (
          <div
            key={position.symbol}
            className="flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors hover:bg-muted/50"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${position.iconBg}`}
            >
              {position.iconLabel}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {position.symbol}
              </p>
              <p className="text-xs text-muted-foreground">{position.quantity}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground">
                {position.value}
              </p>
              <ChangeIndicator
                value={`${position.pnl} / ${position.pnlPct}`}
                positive={position.positive}
                className="text-xs"
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
