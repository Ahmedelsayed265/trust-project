"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/shared/components/page-header";
import { Sparkline } from "@/shared/components/sparkline";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import { routes } from "@/shared/lib/routes";
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  useTrading,
} from "@/shared/trading";

export function PortfolioView() {
  const { snapshot, positions, activeProvider, loading, error } = useTrading();
  const currency = snapshot?.currency ?? "USD";
  const equity = snapshot?.equity ?? 0;
  const invested = positions.reduce((sum, p) => sum + p.marketValue, 0);
  const openPnl = snapshot?.openPnl ?? 0;

  const holdings = [
    ...positions.map((p) => ({
      symbol: p.symbol,
      name: p.symbol,
      allocation:
        equity > 0 ? `${((p.marketValue / equity) * 100).toFixed(0)}%` : "—",
      value: formatMoney(p.marketValue, currency),
      pnl: formatPct((p.unrealizedPnl / (p.marketValue - p.unrealizedPnl || 1)) * 100),
      positive: p.unrealizedPnl >= 0,
      data: [30, 35, 32, 40, 45, 48, 52],
    })),
    ...(snapshot?.balances
      .filter((b) => b.free + b.locked > 0 && (b.usdValue ?? 0) > 0)
      .filter((b) => !positions.some((p) => p.symbol.startsWith(b.asset)))
      .map((b) => ({
        symbol: b.asset,
        name: `${b.asset} (free)`,
        allocation:
          equity > 0
            ? `${(((b.usdValue ?? 0) / equity) * 100).toFixed(0)}%`
            : "—",
        value: formatMoney(b.usdValue ?? 0, currency),
        pnl: "0.0%",
        positive: true,
        data: [50, 50, 50, 50, 50, 50, 50],
      })) ?? []),
  ];

  const stats = [
    {
      label: "Provider equity",
      value: snapshot ? formatMoney(equity, currency) : "—",
      change: snapshot ? formatPct(snapshot.dayPnlPct) : null,
    },
    {
      label: "Positions value",
      value: snapshot ? formatMoney(invested, currency) : "—",
      change: null,
    },
    {
      label: "Unrealized P&L",
      value: snapshot ? formatSignedMoney(openPnl, currency) : "—",
      change: null,
    },
    {
      label: "Day change",
      value: snapshot ? formatSignedMoney(snapshot.dayPnl, currency) : "—",
      change: snapshot ? formatPct(snapshot.dayPnlPct) : null,
    },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Portfolio"
        description={`Read-only holdings from ${activeProvider.displayName}. No internal TrustAI wallet.`}
        actions={
          <>
            <Button
              variant="outline"
              className="rounded-md"
              render={<Link href={routes.trades} />}
            >
              Trade
            </Button>
            <Button
              className="rounded-md"
              nativeButton={false}
              render={<Link href={routes.accounts} />}
            >
              Manage accounts
            </Button>
          </>
        }
      />

      {(error || (!loading && !snapshot)) && (
        <p className="rounded-[12px] border border-border px-4 py-3 text-sm text-muted-foreground">
          {error ?? "Connect a trading provider to load portfolio balances."}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="" size="sm">
            <CardContent>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-foreground">
                {loading ? "…" : stat.value}
              </p>
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
              Provider
            </Badge>
          </CardHeader>
          <CardContent>
            <Sparkline
              data={[42, 45, 43, 48, 52, 50, 55, 58, 54, 60, 63, 68, 65, 72, 78]}
              fill
              showDot
              className="h-40 w-full"
              strokeWidth={2.25}
            />
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {holdings.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No provider holdings yet.
              </p>
            )}
            {holdings.map((item) => (
              <div
                key={item.symbol}
                className="flex items-center justify-between gap-3 rounded-[12px] border border-border px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-foreground">{item.symbol}</p>
                  <p className="text-xs text-muted-foreground">{item.name}</p>
                </div>
                <Sparkline
                  data={item.data}
                  positive={item.positive}
                  className="h-8 w-16"
                />
                <div className="text-right">
                  <p className="text-sm font-semibold">{item.value}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.allocation} · {item.pnl}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
