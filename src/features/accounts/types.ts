export type AccountProviderId = 'binance-spot' | 'alpaca';

export type AccountStatus = 'connected' | 'disconnected' | 'error' | 'pending';

export type AccountEnvironment = 'live' | 'paper';

export type ConnectedAccount = {
  id: number;
  provider_id: AccountProviderId | string;
  label: string;
  environment: AccountEnvironment | string;
  status: AccountStatus | string;
  is_connected: boolean;
  is_default: boolean;
  mode: string;
  permissions: string[];
  capabilities: string[];
  api_key_masked: string | null;
  quote_asset: string;
  last_synced_at: string | null;
  last_synced_label: string | null;
  error_message: string | null;
  created_at: string;
};

export type AccountProviderCatalogItem = {
  id: AccountProviderId | string;
  display_name: string;
  description: string;
  asset_class: string;
  environments: string[];
  quote_asset: string;
  capabilities: string[];
};

export type UserAccountsData = {
  accounts: ConnectedAccount[];
  mode: string;
  providers?: AccountProviderCatalogItem[];
};

export type AccountsListData = {
  accounts: ConnectedAccount[];
  providers: AccountProviderCatalogItem[];
  mode: string;
};

export type SyncSnapshotBalance = {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usd_value: number | null;
};

export type SyncSnapshotPosition = {
  id: string;
  symbol: string;
  display_symbol?: string;
  side: string;
  qty: number;
  avg_entry_price: number;
  mark_price: number;
  unrealized_pnl: number;
  unrealized_pnl_pct?: number;
  market_value: number;
  is_positive?: boolean;
};

export type SyncSnapshot = {
  provider_id: string;
  equity: number;
  buying_power: number;
  positions_value?: number;
  currency: string;
  day_pnl: number;
  day_pnl_pct: number;
  open_pnl: number;
  open_pnl_pct?: number;
  is_positive?: boolean;
  balances: SyncSnapshotBalance[];
  positions: SyncSnapshotPosition[];
  as_of: string;
};

export type SyncAccountsData = {
  synced: { provider_id: string; snapshot: SyncSnapshot }[];
  accounts: ConnectedAccount[];
};
