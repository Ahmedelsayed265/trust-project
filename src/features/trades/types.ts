import type {
  AccountProviderCatalogItem,
  ConnectedAccount,
} from '@/features/accounts/types';
import type { Signal } from '@/features/ai-signals/types';
import type { MarketSymbol } from '@/features/markets/types';
import type {
  PortfolioData,
  PortfolioPosition,
} from '@/features/portfolio/types';

export type TradesPageData = {
  accounts: ConnectedAccount[];
  providers: AccountProviderCatalogItem[];
  portfolio: PortfolioData | null;
  positions: PortfolioPosition[];
  markets: MarketSymbol[];
  signal: Signal | null;
  initialProviderId: string | null;
  initialSymbol: string;
};
