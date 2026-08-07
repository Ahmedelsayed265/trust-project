import type { Signal } from '@/features/ai-signals/types';
import type { MarketTickerItem } from '@/features/markets/types';
import type { Notification } from '@/features/notifications/types';
import type { WatchlistItem } from '@/features/watchlist/types';

export type HomeUser = {
  name: string;
  initials: string;
  plan: string;
};

export type HomePortfolio = {
  equity: number;
  buying_power: number;
  day_pnl: number;
  day_pnl_pct: number;
  open_pnl: number;
  is_positive: boolean;
  currency: string;
  has_accounts: boolean;
};

export type HomeAllocation = {
  symbol: string;
  display_symbol: string;
  value: number;
  percent: number;
};

export type HomeActivity = {
  id: string;
  order_id: string;
  symbol: string;
  display_symbol: string;
  side: string;
  qty: number;
  price: number;
  notional: number;
  fee: number;
  fee_asset: string;
  created_at: string;
  provider_id: string;
};

export type HomePosition = {
  id: string;
  symbol: string;
  display_symbol: string;
  side: string;
  qty: number;
  avg_entry_price: number;
  mark_price: number;
  unrealized_pnl: number;
  unrealized_pnl_pct: number;
  market_value: number;
  is_positive: boolean;
};

export type HomeAccount = {
  provider_id: string;
  label: string;
  environment: string;
  equity: number;
  buying_power: number;
  day_pnl: number;
  currency: string;
};

export type HomeTickerItem = Omit<MarketTickerItem, 'name'> & {
  name?: string;
};

export type HomeData = {
  user: HomeUser;
  portfolio: HomePortfolio;
  allocation: HomeAllocation[];
  watchlist: WatchlistItem[];
  market_highlights: WatchlistItem[];
  top_signal: Signal | null;
  recent_activity: HomeActivity[];
  positions: HomePosition[];
  accounts: HomeAccount[];
  unread_notifications: number;
  notifications: Notification[];
  ticker: HomeTickerItem[];
};
