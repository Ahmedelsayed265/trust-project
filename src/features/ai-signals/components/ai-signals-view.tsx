import { ArrowDownRight, ArrowUpRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/shared/components/page-header";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { routes } from "@/shared/lib/routes";

const signals = [
  {
    pair: "BTC/USDT",
    side: "BUY" as const,
    strength: "Strong",
    confidence: 78,
    price: "$67,432.10",
    updated: "30s ago",
  },
  {
    pair: "ETH/USDT",
    side: "BUY" as const,
    strength: "Moderate",
    confidence: 64,
    price: "$3,456.78",
    updated: "2m ago",
  },
  {
    pair: "SOL/USDT",
    side: "SELL" as const,
    strength: "Watch",
    confidence: 51,
    price: "$175.32",
    updated: "5m ago",
  },
  {
    pair: "XAU/USD",
    side: "BUY" as const,
    strength: "Strong",
    confidence: 72,
    price: "$2,345.80",
    updated: "8m ago",
  },
];

export function AiSignalsView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="AI Signals"
        description="Confidence-scored trade ideas updated in real time."
        actions={
          <Button className="rounded-xl" render={<Link href={routes.trades} />}>
            Open Trade Desk
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Active Signals", value: "12" },
          { label: "Avg. Confidence", value: "71%" },
          { label: "Win Rate (30D)", value: "64%" },
        ].map((stat) => (
          <Card key={stat.label} className="" size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {signals.map((signal) => {
          const isBuy = signal.side === "BUY";
          return (
            <Card key={signal.pair} className="">
              <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "flex size-12 flex-col items-center justify-center rounded-xl",
                      isBuy
                        ? "bg-emerald-50 text-success dark:bg-emerald-950/40"
                        : "bg-red-50 text-destructive dark:bg-red-950/40"
                    )}
                  >
                    {isBuy ? (
                      <ArrowUpRight className="size-5" />
                    ) : (
                      <ArrowDownRight className="size-5" />
                    )}
                    <span className="text-[10px] font-bold">{signal.side}</span>
                  </div>
                  <div>
                    <CardTitle className="text-base">{signal.pair}</CardTitle>
                    <p className="text-xs text-muted-foreground">
                      Updated {signal.updated}
                    </p>
                  </div>
                </div>
                <Badge
                  className={cn(
                    "border-0",
                    isBuy
                      ? "bg-emerald-50 text-success hover:bg-emerald-50 dark:bg-emerald-950/40"
                      : "bg-red-50 text-destructive hover:bg-red-50 dark:bg-red-950/40"
                  )}
                >
                  {signal.strength}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Spot Price</span>
                  <span className="font-semibold text-foreground">
                    {signal.price}
                  </span>
                </div>
                <div>
                  <div className="mb-1.5 flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Sparkles className="size-3.5" />
                      Confidence
                    </span>
                    <span className="font-semibold text-foreground">
                      {signal.confidence}%
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${signal.confidence}%` }}
                    />
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="h-9 w-full rounded-xl"
                  render={<Link href={routes.trades} />}
                >
                  Act on Signal
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
