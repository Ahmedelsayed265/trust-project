"use client";

import { Crown, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ChangeIndicator } from "@/shared/components/change-indicator";
import { currentUser } from "@/shared/lib/user";
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  useTrading,
} from "@/shared/trading";

export function ProfileAccountOverview() {
  const { snapshot, activeProvider, loading } = useTrading();
  const currency = snapshot?.currency ?? "USD";

  return (
    <Card className="">
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Crown className="size-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Current Plan</p>
              <p className="text-base font-bold text-foreground">
                {currentUser.plan}
              </p>
              <p className="text-xs text-muted-foreground">
                Renews May 15, 2026
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">
              Provider equity · {activeProvider.displayName}
            </p>
            <p className="text-base font-bold text-foreground">
              {loading
                ? "…"
                : snapshot
                  ? formatMoney(snapshot.equity, currency)
                  : "—"}
            </p>
            {snapshot && (
              <div className="mt-0.5 flex items-center gap-1 text-xs font-semibold text-success">
                <TrendingUp className="size-3.5" />
                {formatSignedMoney(snapshot.dayPnl, currency)} (
                {formatPct(snapshot.dayPnlPct)})
              </div>
            )}
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Buying Power</p>
            <p className="text-base font-bold text-foreground">
              {snapshot
                ? formatMoney(snapshot.buyingPower, currency)
                : "—"}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Day P&L</p>
            {snapshot ? (
              <ChangeIndicator
                value={`${formatSignedMoney(snapshot.dayPnl, currency)} (${formatPct(snapshot.dayPnlPct)})`}
                className="text-base font-bold"
              />
            ) : (
              <p className="text-base font-bold text-foreground">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
