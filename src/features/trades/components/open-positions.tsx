import Link from 'next/link';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import { openPositions } from '@/features/trades/data/positions';
export function OpenPositions() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>Open Positions ({openPositions.length})</CardTitle>
        <CardAction>
          <Link
            href="/trades"
            className="text-primary text-sm font-medium hover:underline"
          >
            View All
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {openPositions.map((position) => (
          <div
            key={position.symbol}
            className="hover:bg-muted/50 flex items-center gap-3 rounded-xl px-1 py-2.5 transition-colors"
          >
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${position.iconBg}`}
            >
              {position.iconLabel}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-foreground text-sm font-semibold">
                {position.symbol}
              </p>
              <p className="text-muted-foreground text-xs">
                {position.quantity}
              </p>
            </div>
            <div className="text-right">
              <p className="text-foreground text-sm font-semibold">
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
