"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  formatMoney,
  type PortfolioSnapshot,
  type ProviderAccount,
} from "@/shared/trading";
import { formatRelativeTime } from "@/features/portfolio/lib/portfolio-data";

const STATUS_TONE: Record<ProviderAccount["status"], string> = {
  connected: "bg-success/12 text-success",
  pending: "bg-chart-4/12 text-chart-4",
  disconnected: "bg-muted text-muted-foreground",
  error: "bg-destructive/12 text-destructive",
};

export function PortfolioAccount({
  account,
  snapshot,
  providerName,
  loading,
}: {
  account: ProviderAccount | undefined;
  snapshot: PortfolioSnapshot | null;
  providerName: string;
  loading: boolean;
}) {
  const currency = snapshot?.currency ?? "USD";
  const locked =
    snapshot?.balances.reduce((sum, balance) => {
      const total = balance.free + balance.locked;
      const usd = balance.usdValue ?? 0;
      return sum + (total > 0 ? (balance.locked / total) * usd : 0);
    }, 0) ?? 0;

  const rows = [
    { label: "Provider", value: providerName },
    { label: "Environment", value: account?.environment ?? "—" },
    { label: "Reporting currency", value: currency },
    {
      label: "Locked in orders",
      value: snapshot ? formatMoney(locked, currency) : "—",
    },
    {
      label: "Last sync",
      value: account?.lastSyncedAt
        ? formatRelativeTime(account.lastSyncedAt)
        : "Never",
    },
  ];

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Account</CardTitle>
        {account && (
          <Badge
            variant="secondary"
            className={cn("border-0 capitalize", STATUS_TONE[account.status])}
          >
            {account.status}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {loading ? (
          [0, 1, 2, 3].map((index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))
        ) : (
          <>
            <dl className="space-y-2.5">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <dt className="text-muted-foreground">{row.label}</dt>
                  <dd className="truncate font-medium text-foreground capitalize">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="text-xs leading-relaxed text-muted-foreground">
              Balances are read directly from {providerName}. TrustAI never holds
              funds and cannot move them between accounts.
            </p>

            <Button
              variant="outline"
              className="w-full rounded-md"
              nativeButton={false}
              render={<Link href="/accounts" />}
            >
              Manage connection
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
