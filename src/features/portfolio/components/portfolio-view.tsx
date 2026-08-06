'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/page-header';
import { cn } from '@/lib/utils';
import { useTrading } from '@/shared/trading';
import { PortfolioAccount } from '@/features/portfolio/components/portfolio-account';
import { PortfolioAllocation } from '@/features/portfolio/components/portfolio-allocation';
import { PortfolioHoldings } from '@/features/portfolio/components/portfolio-holdings';
import { PortfolioOpenOrders } from '@/features/portfolio/components/portfolio-open-orders';
import { PortfolioPerformance } from '@/features/portfolio/components/portfolio-performance';
import { PortfolioStats } from '@/features/portfolio/components/portfolio-stats';
import {
  buildHoldings,
  formatRelativeTime,
} from '@/features/portfolio/lib/portfolio-data';

export function PortfolioView() {
  const {
    snapshot,
    positions,
    openOrders,
    accounts,
    activeProvider,
    activeProviderId,
    loading,
    error,
    refresh,
  } = useTrading();

  const holdings = useMemo(
    () => buildHoldings(snapshot, positions),
    [snapshot, positions],
  );
  const currency = snapshot?.currency ?? 'USD';
  const account = accounts.find((item) => item.providerId === activeProviderId);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Portfolio"
        description={`Read-only holdings from ${activeProvider.displayName}. No internal TrustAI wallet.`}
        actions={
          <>
            {snapshot && (
              <span className="text-muted-foreground mr-1 hidden items-center gap-1.5 text-xs sm:inline-flex">
                <span className="bg-success size-1.5 rounded-full" />
                Synced {formatRelativeTime(snapshot.asOf)}
              </span>
            )}
            <Button
              variant="outline"
              size="icon"
              className="rounded-md"
              aria-label="Refresh portfolio"
              disabled={loading}
              onClick={() => void refresh()}
            >
              <RefreshCw className={cn('size-4', loading && 'animate-spin')} />
            </Button>
            <Button
              variant="outline"
              className="rounded-md"
              nativeButton={false}
              render={<Link href="/trades" />}
            >
              Trade
            </Button>
            <Button
              className="rounded-md"
              nativeButton={false}
              render={<Link href="/accounts" />}
            >
              Manage accounts
            </Button>
          </>
        }
      />

      {(error || (!loading && !snapshot)) && (
        <div className="border-border bg-card flex flex-col gap-3 rounded-[12px] border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="text-chart-4 mt-0.5 size-4 shrink-0" />
            <p className="text-muted-foreground text-sm">
              {error ??
                'Connect a trading provider to load portfolio balances.'}
            </p>
          </div>
          <Button
            variant="outline"
            className="shrink-0 rounded-md"
            onClick={() => void refresh()}
          >
            Try again
          </Button>
        </div>
      )}

      <PortfolioStats
        snapshot={snapshot}
        holdings={holdings}
        loading={loading}
      />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <PortfolioPerformance snapshot={snapshot} loading={loading} />
        <PortfolioAllocation
          holdings={holdings}
          currency={currency}
          loading={loading}
        />
      </div>

      <PortfolioHoldings
        holdings={holdings}
        currency={currency}
        loading={loading}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <PortfolioOpenOrders
          orders={openOrders}
          currency={currency}
          loading={loading}
        />
        <PortfolioAccount
          account={account}
          snapshot={snapshot}
          providerName={activeProvider.displayName}
          loading={loading}
        />
      </div>
    </div>
  );
}
