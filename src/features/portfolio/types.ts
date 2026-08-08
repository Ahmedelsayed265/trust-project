export type PortfolioPosition = {
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

export type PortfolioAccountSummary = {
  provider_id: string;
  label: string;
  environment: string;
  equity: number;
  buying_power: number;
  day_pnl: number;
  currency: string;
};

export type PortfolioData = {
  equity: number;
  buying_power: number;
  day_pnl: number;
  day_pnl_pct: number;
  open_pnl: number;
  is_positive: boolean;
  currency: string;
  positions: PortfolioPosition[];
  positions_count: number;
  accounts: PortfolioAccountSummary[];
};

export type PortfolioAllocationSlice = {
  symbol: string;
  display_symbol: string;
  value: number;
  percent: number;
};

export type PortfolioBalance = {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usd_value: number | null;
};

export type PortfolioBalancesData = {
  provider_id: string;
  currency: string;
  balances: PortfolioBalance[];
};

export type PortfolioHistoryRange = '1d' | '1w' | '1m' | '3m' | '1y' | 'all';

export type PortfolioHistoryPoint = {
  date: string;
  label: string;
  equity: number;
  day_pnl: number;
};

export type PortfolioHistoryData = {
  range: PortfolioHistoryRange | string;
  points: PortfolioHistoryPoint[];
  start: number;
  end: number;
  change: number;
  change_pct: number;
  is_positive: boolean;
};

export type GetPortfolioInput = {
  provider_id?: string;
  fresh?: boolean;
};
