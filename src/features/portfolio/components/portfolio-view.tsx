'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/page-header';
import { cn } from '@/lib/utils';
import type { Order } from '@/features/orders/types';
import { PortfolioAccount } from '@/features/portfolio/components/portfolio-account';
import { PortfolioAllocation } from '@/features/portfolio/components/portfolio-allocation';
import { PortfolioBalances } from '@/features/portfolio/components/portfolio-balances';
import { PortfolioHoldings } from '@/features/portfolio/components/portfolio-holdings';
import { PortfolioOpenOrders } from '@/features/portfolio/components/portfolio-open-orders';
import { PortfolioPerformance } from '@/features/portfolio/components/portfolio-performance';
import { PortfolioStats } from '@/features/portfolio/components/portfolio-stats';
import { usePortfolio } from '@/features/portfolio/hooks/use-portfolio';
import { buildHoldings } from '@/features/portfolio/lib/portfolio-data';
import type {
  PortfolioAllocationSlice,
  PortfolioBalancesData,
  PortfolioData,
  PortfolioHistoryData,
} from '@/features/portfolio/types';

type PortfolioViewProps = {
  initialPortfolio: PortfolioData;
  initialAllocation: PortfolioAllocationSlice[];
  initialOrders: Order[];
  initialHistory: PortfolioHistoryData | null;
  initialBalances: PortfolioBalancesData | null;
};

export function PortfolioView({
  initialPortfolio,
  initialAllocation,
  initialOrders,
  initialHistory,
  initialBalances,
}: PortfolioViewProps) {
  const { portfolio, allocation, orders, pending, refresh } = usePortfolio({
    initialPortfolio,
    initialAllocation,
    initialOrders,
  });

  const holdings = useMemo(
    () => buildHoldings(portfolio.positions, allocation, portfolio.equity),
    [portfolio.positions, portfolio.equity, allocation],
  );

  const hasAccounts = portfolio.accounts.length > 0;
  const balancesProvider =
    portfolio.accounts.find(
      (account) => account.provider_id === initialBalances?.provider_id,
    )?.label ??
    initialBalances?.provider_id ??
    null;
  const providerLabel = hasAccounts
    ? portfolio.accounts.map((account) => account.label).join(' · ')
    : 'no linked providers';

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Portfolio"
        description={`Read-only holdings from ${providerLabel}. No internal TrustAI wallet.`}
        actions={
          <>
            <Button
              variant="outline"
              size="icon"
              className="rounded-md"
              aria-label="Refresh portfolio"
              disabled={pending}
              onClick={refresh}
            >
              <RefreshCw className={cn('size-4', pending && 'animate-spin')} />
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

      {!hasAccounts && (
        <div className="border-border bg-card flex flex-col gap-3 rounded-[12px] border px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="text-chart-4 mt-0.5 size-4 shrink-0" />
            <p className="text-muted-foreground text-sm">
              Connect a trading provider to load portfolio balances.
            </p>
          </div>
          <Button
            className="shrink-0 rounded-md"
            nativeButton={false}
            render={<Link href="/accounts" />}
          >
            Connect provider
          </Button>
        </div>
      )}

      <PortfolioStats portfolio={portfolio} />

      <div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
        <PortfolioPerformance
          initialHistory={initialHistory}
          currency={portfolio.currency}
        />
        <PortfolioAllocation
          allocation={allocation}
          currency={portfolio.currency}
        />
      </div>

      <PortfolioHoldings holdings={holdings} currency={portfolio.currency} />

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <PortfolioOpenOrders orders={orders} currency={portfolio.currency} />
        <PortfolioBalances
          balances={initialBalances}
          providerLabel={balancesProvider}
        />
        <PortfolioAccount accounts={portfolio.accounts} />
      </div>
    </div>
  );
}
