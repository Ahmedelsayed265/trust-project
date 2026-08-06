import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
export function TradeAiSignal() {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>AI Signal</CardTitle>
        <CardAction>
          <span className="text-muted-foreground text-xs">Updated 30s ago</span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex size-14 flex-col items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/40">
            <ArrowUpRight className="text-success size-5" strokeWidth={2.5} />
            <span className="text-success text-xs font-bold">BUY</span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground text-base font-bold">BUY</span>
              <Badge className="text-success dark:text-success border-0 bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40">
                Strong
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">BTC/USDT · Market</p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Confidence</span>
            <span className="text-foreground font-semibold">78%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div className="bg-primary h-full w-[78%] rounded-full" />
          </div>
        </div>

        <Link
          href="/markets"
          className="text-primary inline-flex text-sm font-medium hover:underline"
        >
          View on Asset Page →
        </Link>
      </CardContent>
    </Card>
  );
}
