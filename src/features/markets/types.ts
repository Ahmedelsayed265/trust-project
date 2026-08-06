export type MarketAssetClass =
  'crypto' | 'stocks' | 'metals' | 'forex' | 'indices';

export type MarketSort = 'change' | 'price' | 'volume' | 'name' | 'market_cap';

export type MarketSymbol = {
  id: number;
  symbol: string;
  display_symbol: string;
  name: string;
  provider_id: string;
  asset_class: MarketAssetClass | string;
  base_asset: string;
  quote_asset: string;
  icon_label: string | null;
  icon_bg: string | null;
  is_tradable: boolean;
  min_qty: number;
  qty_step: number;
  price_step: number;
  price: number;
  change_24h: number;
  change_24h_pct: number;
  is_positive: boolean;
  high_24h: number | null;
  low_24h: number | null;
  volume_24h: number | null;
  quote_volume_24h: number | null;
  market_cap: number | null;
  sparkline: number[];
  quoted_at: string | null;
  is_watchlisted?: boolean | unknown;
};

export type MarketMover = {
  symbol: string;
  display_symbol: string;
  change_24h_pct: number;
  price: number;
};

export type MarketsSummary = {
  total_symbols: number;
  gainers: number;
  losers: number;
  avg_change_pct: number;
  total_volume_24h: number;
  top_gainer: MarketMover | null;
  top_loser: MarketMover | null;
};

export type MarketsPagination = {
  current_page: number;
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type MarketsListData = {
  items: MarketSymbol[];
  summary: MarketsSummary;
  pagination: MarketsPagination;
};

export type GetMarketsInput = {
  asset_class?: MarketAssetClass | string;
  provider_id?: string;
  search?: string;
  sort?: MarketSort;
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
};

export type MarketCategory = {
  key: string;
  label: string;
  count: number;
};

export type MarketSymbolDetail = MarketSymbol & {
  active_signals: number;
  related: MarketSymbol[];
};

export type MarketTickerItem = {
  symbol: string;
  display_symbol: string;
  name: string;
  price: number;
  change_24h_pct: number;
  is_positive: boolean;
};
