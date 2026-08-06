'use client';

import { TrendingUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import {
  formatMoney,
  formatPct,
  formatSignedMoney,
  useTrading,
} from '@/shared/trading';

export function AccountSummary() {
  const { snapshot, activeProvider, loading, error } = useTrading();
  const currency = snapshot?.currency ?? 'USD';

  const metrics = [
    {
      label: 'Buying Power',
      value:
        snapshot != null ? formatMoney(snapshot.buyingPower, currency) : '—',
    },
    {
      label: 'Open P&L',
      value:
        snapshot != null ? formatSignedMoney(snapshot.openPnl, currency) : '—',
      positive: (snapshot?.openPnl ?? 0) >= 0,
    },
    {
      label: 'Day P&L',
      value:
        snapshot != null ? formatSignedMoney(snapshot.dayPnl, currency) : '—',
      positive: (snapshot?.dayPnl ?? 0) >= 0,
    },
  ];

  return (
    <Card className="">
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Account equity · {activeProvider.displayName}
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {loading
                ? '…'
                : snapshot
                  ? formatMoney(snapshot.equity, currency)
                  : '—'}
            </p>
            {snapshot ? (
              <div className="text-success mt-1.5 flex flex-wrap items-center gap-1.5 text-sm font-semibold">
                <TrendingUp className="size-4" />
                <span>
                  {formatSignedMoney(snapshot.dayPnl, currency)} (
                  {formatPct(snapshot.dayPnlPct)})
                </span>
                <span className="text-muted-foreground font-normal">Today</span>
              </div>
            ) : (
              <p className="text-muted-foreground mt-1.5 text-sm">
                {error ?? 'Connect a provider to view equity.'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-[120px]">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {metric.label}
                </p>
                {metric.positive !== undefined && snapshot ? (
                  <ChangeIndicator
                    value={metric.value}
                    className="mt-1 text-base font-bold sm:text-lg"
                  />
                ) : (
                  <p className="text-foreground mt-1 text-base font-bold sm:text-lg">
                    {metric.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
