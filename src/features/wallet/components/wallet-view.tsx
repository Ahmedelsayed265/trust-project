"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Copy, WalletCards } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/shared/components/page-header";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import {
  WalletTransferSheet,
  type WalletAction,
} from "@/features/wallet/components/wallet-transfer-sheet";
import { routes } from "@/shared/lib/routes";

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

function parseAction(value: string | null): WalletAction | null {
  if (value === "deposit" || value === "withdraw") return value;
  return null;
}

export function WalletView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [action, setAction] = useState<WalletAction | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const next = parseAction(searchParams.get("action"));
    if (next) setAction(next);
  }, [searchParams]);

  function openAction(next: WalletAction) {
    setAction(next);
    router.replace(`${routes.wallet}?action=${next}`, { scroll: false });
  }

  function handleOpenChange(open: boolean) {
    if (open) return;
    setAction(null);
    router.replace(routes.wallet, { scroll: false });
  }

  async function handleCopyAddress() {
    try {
      await navigator.clipboard.writeText("0x7f2a9c14b8e3d1a6f0c5e2b9471d8a3f");
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore clipboard errors in unsupported environments
    }
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Wallet"
        description="Manage balances, deposits, and withdrawals."
        actions={
          <>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => openAction("withdraw")}
            >
              <ArrowUpRight />
              Withdraw
            </Button>
            <Button
              type="button"
              className="rounded-xl"
              onClick={() => openAction("deposit")}
            >
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
              <p className="text-muted-foreground">
                {copied ? "Address copied" : "Deposit address"}
              </p>
              <div className="mt-1 flex items-center gap-2 font-mono text-xs text-foreground">
                <span className="truncate">0x7f2a…9c14</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Copy"
                  onClick={handleCopyAddress}
                >
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

      <WalletTransferSheet
        action={action}
        open={action !== null}
        onOpenChange={handleOpenChange}
      />
    </div>
  );
}
