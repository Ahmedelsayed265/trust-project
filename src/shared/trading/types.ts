/** Shared trading domain types — always sourced from a connected provider. */

export type ProviderId = 'binance-spot' | 'alpaca';

export type ProviderCapability =
  | 'spotTrading'
  | 'stockTrading'
  | 'paperTrading'
  | 'marketOrders'
  | 'limitOrders'
  | 'cancelOrders'
  | 'readBalances'
  | 'readPositions'
  | 'readOrders'
  | 'readFills'
  | 'marketData'
  /** In-app deposit/withdraw only if the provider exposes it officially. */
  | 'inAppDeposit'
  | 'inAppWithdraw';

export type ProviderAccount = {
  id: string;
  providerId: ProviderId;
  label: string;
  /** e.g. Binance Spot, Alpaca Paper */
  environment: string;
  status: 'connected' | 'disconnected' | 'error' | 'pending';
  permissions: string[];
  lastSyncedAt: string | null;
  errorMessage?: string;
};

export type ProviderBalance = {
  asset: string;
  free: number;
  locked: number;
  /** USD/USDT notional from provider valuation when available */
  usdValue: number | null;
};

export type ProviderPosition = {
  id: string;
  symbol: string;
  side: 'long' | 'short' | 'flat';
  qty: number;
  avgEntryPrice: number;
  markPrice: number;
  unrealizedPnl: number;
  marketValue: number;
};

export type ProviderOrderStatus =
  'new' | 'partially_filled' | 'filled' | 'canceled' | 'rejected' | 'expired';

export type ProviderOrder = {
  id: string;
  clientOrderId?: string;
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  qty: number;
  filledQty: number;
  limitPrice: number | null;
  avgFillPrice: number | null;
  status: ProviderOrderStatus;
  createdAt: string;
  updatedAt: string;
};

export type ProviderFill = {
  id: string;
  orderId: string;
  symbol: string;
  side: 'buy' | 'sell';
  qty: number;
  price: number;
  fee: number;
  feeAsset: string;
  createdAt: string;
};

export type MarketTicker = {
  symbol: string;
  price: number;
  change24hPct: number;
  high24h?: number;
  low24h?: number;
  volume24h?: number;
};

export type PlaceOrderInput = {
  symbol: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit';
  qty: number;
  limitPrice?: number;
};

export type ProviderErrorCode =
  | 'not_connected'
  | 'insufficient_balance'
  | 'unsupported'
  | 'permission_denied'
  | 'rate_limited'
  | 'invalid_request'
  | 'provider_error';

export class ProviderError extends Error {
  constructor(
    public readonly code: ProviderErrorCode,
    message: string,
    public readonly providerId?: ProviderId,
  ) {
    super(message);
    this.name = 'ProviderError';
  }
}

export type PortfolioSnapshot = {
  providerId: ProviderId;
  /** Equity / total account value from provider */
  equity: number;
  /** Available to trade (free quote/cash from provider) */
  buyingPower: number;
  currency: string;
  dayPnl: number;
  dayPnlPct: number;
  openPnl: number;
  balances: ProviderBalance[];
  positions: ProviderPosition[];
  asOf: string;
};
