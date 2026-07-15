import { ArrowDownLeft, ArrowUpRight, Copy, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/shared/components/page-header";
import { ChangeIndicator } from "@/shared/components/change-indicator";

const balances = [
  { asset: "USDT", name: "Tether", amount: "8,642.21", value: "$8,642.21" },
  { asset: "BTC", name: "Bitcoin", amount: "0.0824", value: "$5,552.10" },
  { asset: "ETH", name: "Ethereum", amount: "1.4500", value: "$5,003.18" },
  { asset: "USD", name: "US Dollar", amount: "2,085.08", value: "$2,085.08" },
];

const transfers = [
  {
    type: "Deposit",
    asset: "USDT",
    amount: "+2,000.00",
    positive: true,
    time: "Today, 10:24",
  },
  {
    type: "Withdraw",
    asset: "USD",
    amount: "-500.00",
    positive: false,
    time: "Yesterday, 18:02",
  },
  {
    type: "Deposit",
    asset: "BTC",
    amount: "+0.0150",
    positive: true,
    time: "Mar 12, 14:40",
  },
];

export function WalletView() {
  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Wallet"
        description="Manage balances, deposits, and withdrawals."
        actions={
          <>
            <Button variant="outline" className="rounded-xl">
              <ArrowUpRight />
              Withdraw
            </Button>
            <Button className="rounded-xl">
              <ArrowDownLeft />
              Deposit
            </Button>
          </>
        }
      />

      <Card className="">
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <WalletCards className="size-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available Balance</p>
                <p className="text-3xl font-bold tracking-tight text-foreground">
                  $21,282.57
                </p>
                <ChangeIndicator value="+$420.18 today" className="mt-1 text-xs" />
              </div>
            </div>
            <div className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm">
              <p className="text-muted-foreground">Deposit address</p>
              <div className="mt-1 flex items-center gap-2 font-mono text-xs text-foreground">
                <span className="truncate">0x7f2a…9c14</span>
                <Button type="button" variant="ghost" size="icon-xs" aria-label="Copy">
                  <Copy />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="">
          <CardHeader>
            <CardTitle>Balances</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {balances.map((item) => (
              <div
                key={item.asset}
                className="flex items-center justify-between rounded-xl px-1 py-2.5 hover:bg-muted/40"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {item.asset}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-foreground">
                    {item.amount}
                  </p>
                  <p className="text-xs text-muted-foreground">{item.value}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle>Recent Transfers</CardTitle>
            <Badge variant="secondary" className="border-0">
              30D
            </Badge>
          </CardHeader>
          <CardContent className="space-y-2">
            {transfers.map((item) => (
              <div
                key={`${item.type}-${item.time}`}
                className="flex items-center justify-between rounded-xl px-1 py-2.5 hover:bg-muted/40"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      item.positive
                        ? "flex size-9 items-center justify-center rounded-full bg-emerald-50 text-success dark:bg-emerald-950/40"
                        : "flex size-9 items-center justify-center rounded-full bg-red-50 text-destructive dark:bg-red-950/40"
                    }
                  >
                    {item.positive ? (
                      <ArrowDownLeft className="size-4" />
                    ) : (
                      <ArrowUpRight className="size-4" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {item.type} · {item.asset}
                    </p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
                <ChangeIndicator
                  value={item.amount}
                  positive={item.positive}
                  className="text-sm"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
