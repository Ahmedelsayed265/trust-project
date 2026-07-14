import { PortfolioValue } from "@/features/dashboard/components/portfolio-value";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { MarketHighlights } from "@/features/dashboard/components/market-highlights";
import { AISignal } from "@/features/dashboard/components/ai-signal";
import { PortfolioDistribution } from "@/features/dashboard/components/portfolio-distribution";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";
import { Watchlist } from "@/features/dashboard/components/watchlist";

export function HomeDashboard() {
  return (
    <div className="flex flex-col gap-4 lg:gap-5">
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(240px,280px)] lg:gap-5">
        <PortfolioValue />
        <QuickActions />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-5">
        <MarketHighlights />
        <AISignal />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 lg:gap-5">
        <PortfolioDistribution />
        <RecentActivity />
        <div className="md:col-span-2 xl:col-span-1">
          <Watchlist />
        </div>
      </div>
    </div>
  );
}
