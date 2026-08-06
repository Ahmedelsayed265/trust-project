'use client';

import { Crown, TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import { useCurrentUser } from '@/shared/providers/user-provider';
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  useTrading,
} from '@/shared/trading';

export function ProfileAccountOverview() {
  const user = useCurrentUser();
  const { snapshot, activeProvider, loading } = useTrading();
  const currency = snapshot?.currency ?? 'USD';

  return (
    <Card className="">
      <CardContent>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300">
              <Crown className="size-5" />
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Current Plan</p>
              <p className="text-foreground text-base font-bold">
                {user.plan?.name ?? 'Free'}
              </p>
              <p className="text-muted-foreground text-xs">
                {user.plan?.renews_at_label
                  ? `Renews ${user.plan.renews_at_label}`
                  : 'No active renewal'}
              </p>
            </div>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">
              Provider equity · {activeProvider.displayName}
            </p>
            <p className="text-foreground text-base font-bold">
              {loading
                ? '…'
                : snapshot
                  ? formatMoney(snapshot.equity, currency)
                  : '—'}
            </p>
            {snapshot && (
              <div className="text-success mt-0.5 flex items-center gap-1 text-xs font-semibold">
                <TrendingUp className="size-3.5" />
                {formatSignedMoney(snapshot.dayPnl, currency)} (
                {formatPct(snapshot.dayPnlPct)})
              </div>
            )}
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Buying Power</p>
            <p className="text-foreground text-base font-bold">
              {snapshot ? formatMoney(snapshot.buyingPower, currency) : '—'}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground text-xs">Day P&L</p>
            {snapshot ? (
              <ChangeIndicator
                value={`${formatSignedMoney(snapshot.dayPnl, currency)} (${formatPct(snapshot.dayPnlPct)})`}
                className="text-base font-bold"
              />
            ) : (
              <p className="text-foreground text-base font-bold">—</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
