import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { routes } from "@/shared/lib/routes";

export function TradeAiSignal() {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>AI Signal</CardTitle>
        <CardAction>
          <span className="text-xs text-muted-foreground">Updated 30s ago</span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-col items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
            <ArrowUpRight className="size-5 text-success" strokeWidth={2.5} />
            <span className="text-xs font-bold text-success">BUY</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-foreground">BUY</span>
              <Badge className="border-0 bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40 dark:text-success">
                Strong
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">BTC/USDT · Market</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="font-semibold text-foreground">78%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[78%] rounded-full bg-primary" />
          </div>
        </div>

        <Link
          href={routes.markets}
          className="inline-flex text-sm font-medium text-primary hover:underline"
        >
          View on Asset Page →
        </Link>
      </CardContent>
    </Card>
  );
}
