export type WatchlistItem = {
  id: number;
  market_symbol_id: number;
  symbol: string;
  display_symbol: string;
  name: string;
  asset_class: string;
  icon_label: string | null;
  icon_bg: string | null;
  price: number;
  change_24h_pct: number;
  is_positive: boolean;
  sparkline: number[];
  alert_above: number | null;
  alert_below: number | null;
  sort: number;
  created_at: string;
};

export type WatchlistSummary = {
  total: number;
  gainers: number;
  losers: number;
};

export type WatchlistData = {
  items: WatchlistItem[];
  summary: WatchlistSummary;
};

export type AddWatchlistInput = {
  symbol: string;
  alert_above?: number | null;
  alert_below?: number | null;
};

export type WatchlistToggleData = {
  watching?: boolean;
  in_watchlist?: boolean;
  item?: WatchlistItem | null;
};
