import { getTranslations } from 'next-intl/server';
import { getOrdersAction } from '@/features/orders/actions/get-orders';
import {
  getPortfolioAction,
  getPortfolioAllocationAction,
  getPortfolioBalancesAction,
  getPortfolioHistoryAction,
} from '@/features/portfolio/actions/get-portfolio';
import { PortfolioView } from '@/features/portfolio';

export default async function PortfolioPage() {
  const t = await getTranslations('Portfolio');
  const [
    portfolioResult,
    allocationResult,
    historyResult,
    ordersResult,
    balancesResult,
  ] = await Promise.all([
    getPortfolioAction(),
    getPortfolioAllocationAction(),
    getPortfolioHistoryAction('1m'),
    getOrdersAction({ status: 'open' }),
    getPortfolioBalancesAction(),
  ]);

  if (!portfolioResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('loadError')}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {portfolioResult.message}
        </p>
      </div>
    );
  }

  return (
    <PortfolioView
      initialPortfolio={portfolioResult.data}
      initialAllocation={allocationResult.ok ? allocationResult.data : []}
      initialHistory={historyResult.ok ? historyResult.data : null}
      initialOrders={ordersResult.ok ? ordersResult.data.items : []}
      initialBalances={balancesResult.ok ? balancesResult.data : null}
    />
  );
}
