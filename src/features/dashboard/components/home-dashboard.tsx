import { PortfolioValue } from '@/features/dashboard/components/portfolio-value';
import { QuickActions } from '@/features/dashboard/components/quick-actions';
import { MarketHighlights } from '@/features/dashboard/components/market-highlights';
import { AISignal } from '@/features/dashboard/components/ai-signal';
import { PortfolioDistribution } from '@/features/dashboard/components/portfolio-distribution';
import { RecentActivity } from '@/features/dashboard/components/recent-activity';
import { Watchlist } from '@/features/dashboard/components/watchlist';
import type { HomeData } from '@/features/dashboard/types';

type HomeDashboardProps = {
  data: HomeData;
};

export function HomeDashboard({ data }: HomeDashboardProps) {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:gap-5">
        <PortfolioValue
          portfolio={data.portfolio}
          plan={data.user.plan}
          accountsCount={data.accounts.length}
        />
        <QuickActions />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-5">
        <MarketHighlights items={data.market_highlights} />
        <AISignal signal={data.top_signal} />
      </div>

      <div className="mb-4 grid gap-4 md:grid-cols-2 lg:gap-5 xl:grid-cols-3">
        <PortfolioDistribution
          allocation={data.allocation}
          equity={data.portfolio.equity}
          currency={data.portfolio.currency}
          hasAccounts={data.portfolio.has_accounts}
        />
        <RecentActivity items={data.recent_activity} />
        <div className="md:col-span-2 xl:col-span-1">
          <Watchlist items={data.watchlist} />
        </div>
      </div>
    </div>
  );
}
