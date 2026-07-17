import { TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/shared/components/page-header";
import { Sparkline } from "@/shared/components/sparkline";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import { routes } from "@/shared/lib/routes";
import Link from "next/link";

const holdings = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    allocation: "42%",
    value: "$10,302.79",
    pnl: "+8.2%",
    positive: true,
    data: [30, 35, 32, 40, 45, 48, 52],
  },
  {
    symbol: "ETH",
    name: "Ethereum",
    allocation: "24%",
    value: "$5,887.31",
    pnl: "+5.1%",
    positive: true,
    data: [28, 30, 34, 32, 38, 42, 40],
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    allocation: "18%",
    value: "$4,415.48",
    pnl: "+2.4%",
    positive: true,
    data: [40, 42, 41, 44, 43, 46, 48],
  },
  {
    symbol: "XAU",
    name: "Gold",
    allocation: "10%",
    value: "$2,453.05",
    pnl: "+0.9%",
    positive: true,
    data: [44, 45, 44, 46, 47, 46, 48],
  },
  {
    symbol: "CASH",
    name: "USD Cash",
    allocation: "6%",
    value: "$1,471.82",
    pnl: "0.0%",
    positive: true,
    data: [50, 50, 50, 50, 50, 50, 50],
  },
];

export function PortfolioView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Portfolio"
        description="Track allocation, performance, and holdings."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" render={<Link href={routes.trades} />}>
              Trade
            </Button>
            <Button className="rounded-xl" nativeButton={false} render={<Link href={`${routes.wallet}?action=deposit`} />}>
              Deposit
            </Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Total Equity", value: "$24,530.45", change: "+5.37%" },
          { label: "Invested", value: "$23,058.63", change: null },
          { label: "Unrealized P&L", value: "+$1,471.82", change: "+6.38%" },
          { label: "Day Change", value: "+$320.45", change: "+1.32%" },
        ].map((stat) => (
          <Card key={stat.label} className="" size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">{stat.value}</p>
              {stat.change && (
                <ChangeIndicator value={stat.change} className="mt-1 text-xs" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Performance</CardTitle>
            <Badge variant="secondary" className="border-0">
              30D
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-success">
              <TrendingUp className="size-4" />
              +12.4% this month
            </div>
            <Sparkline
              data={[35, 38, 36, 42, 40, 48, 52, 50, 58, 62, 70]}
              fill
              className="h-40 w-full"
              strokeWidth={2.5}
            />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Allocation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {holdings.map((item) => (
              <div key={item.symbol} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {item.symbol}
                  </span>
                  <span className="text-muted-foreground">{item.allocation}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: item.allocation }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="">
        <CardHeader>
          <CardTitle>Holdings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 p-0 sm:p-0">
          <div className="scrollbar-thin overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="px-5 py-3 font-medium">Asset</th>
                  <th className="px-4 py-3 font-medium">Allocation</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">P&L</th>
                  <th className="px-4 py-3 font-medium">Trend</th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((item) => (
                  <tr
                    key={item.symbol}
                    className="border-b border-border/70 last:border-0"
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-semibold text-foreground">
                        {item.symbol}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.name}</p>
                    </td>
                    <td className="px-4 py-3.5 text-foreground">
                      {item.allocation}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-foreground">
                      {item.value}
                    </td>
                    <td className="px-4 py-3.5">
                      <ChangeIndicator
                        value={item.pnl}
                        positive={item.positive}
                      />
                    </td>
                    <td className="px-4 py-3.5">
                      <Sparkline
                        data={item.data}
                        positive={item.positive}
                        className="h-8 w-20"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
