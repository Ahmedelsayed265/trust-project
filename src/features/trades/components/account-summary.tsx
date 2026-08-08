'use client';

import Link from 'next/link';
import { TrendingDown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import type { ConnectedAccount } from '@/features/accounts/types';
import type { PortfolioData } from '@/features/portfolio/types';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';

export function AccountSummary({
  portfolio,
  account,
  loading,
  error,
}: {
  portfolio: PortfolioData | null;
  account: ConnectedAccount | null;
  loading?: boolean;
  error?: string | null;
}) {
  const currency = portfolio?.currency ?? account?.quote_asset ?? 'USD';
  const positive = (portfolio?.day_pnl ?? 0) >= 0;
  const PnlIcon = positive ? TrendingUp : TrendingDown;

  const metrics = [
    {
      label: 'Buying Power',
      value:
        portfolio != null ? formatMoney(portfolio.buying_power, currency) : '—',
    },
    {
      label: 'Open P&L',
      value:
        portfolio != null
          ? formatSignedMoney(portfolio.open_pnl, currency)
          : '—',
      positive: (portfolio?.open_pnl ?? 0) >= 0,
    },
    {
      label: 'Day P&L',
      value:
        portfolio != null
          ? formatSignedMoney(portfolio.day_pnl, currency)
          : '—',
      positive: (portfolio?.day_pnl ?? 0) >= 0,
    },
  ];

  return (
    <Card>
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              Account equity
              {account ? ` · ${account.label}` : ''}
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              {loading
                ? '…'
                : portfolio
                  ? formatMoney(portfolio.equity, currency)
                  : '—'}
            </p>
            {portfolio ? (
              <div
                className={
                  positive
                    ? 'text-success mt-1.5 flex flex-wrap items-center gap-1.5 text-sm font-semibold'
                    : 'text-destructive mt-1.5 flex flex-wrap items-center gap-1.5 text-sm font-semibold'
                }
              >
                <PnlIcon className="size-4" />
                <span>
                  {formatSignedMoney(portfolio.day_pnl, currency)} (
                  {formatPct(portfolio.day_pnl_pct)})
                </span>
                <span className="text-muted-foreground font-normal">Today</span>
              </div>
            ) : (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <p className="text-muted-foreground text-sm">
                  {error ?? 'Connect a provider to view equity and trade.'}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  render={<Link href="/accounts" />}
                >
                  Connect account
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-8">
            {metrics.map((metric) => (
              <div key={metric.label} className="min-w-[120px]">
                <p className="text-muted-foreground text-xs sm:text-sm">
                  {metric.label}
                </p>
                {metric.positive !== undefined && portfolio ? (
                  <ChangeIndicator
                    value={metric.value}
                    positive={metric.positive}
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
