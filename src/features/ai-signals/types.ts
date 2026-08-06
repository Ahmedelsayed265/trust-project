export type SignalStatus = 'active' | 'closed' | 'expired' | 'all';
export type SignalSide = 'buy' | 'sell';
export type SignalStrength = 'strong' | 'moderate' | 'watch';

export type Signal = {
  id: number;
  symbol: string;
  display_symbol: string;
  name: string;
  asset_class: string;
  icon_label: string | null;
  icon_bg: string | null;
  side: SignalSide | string;
  strength: SignalStrength | string;
  confidence: number;
  price: number;
  timeframe: string | null;
  status: Exclude<SignalStatus, 'all'> | string;
  outcome: string | null;
  result_pct: number | null;
  is_locked: boolean;
  required_plan_key: string | null;
  entry_low: number | null;
  entry_high: number | null;
  stop_loss: number | null;
  take_profit: number | null;
  risk_reward: number | null;
  rationale: string[];
  issued_at: string;
  updated_label: string | null;
  expires_at: string | null;
};

export type SignalsStats = {
  active_signals: number;
  avg_confidence: number;
  win_rate_30d: number;
  closed_30d: number;
  strong_signals: number;
};

export type SignalsPagination = {
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

export type SignalsListData = {
  items: Signal[];
  stats: SignalsStats;
  pagination: SignalsPagination;
};

export type GetSignalsInput = {
  status?: SignalStatus;
  side?: SignalSide;
  strength?: SignalStrength;
  symbol?: string;
  asset_class?: string;
  page?: number;
  per_page?: number;
};
