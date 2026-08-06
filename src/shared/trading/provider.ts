import type {
  MarketTicker,
  PlaceOrderInput,
  PortfolioSnapshot,
  ProviderAccount,
  ProviderBalance,
  ProviderCapability,
  ProviderFill,
  ProviderId,
  ProviderOrder,
  ProviderPosition,
} from '@/shared/trading/types';

/**
 * Unified trading provider contract.
 * UI must call these methods only — never invent balances or custody flows.
 */
export interface TradingProvider {
  readonly id: ProviderId;
  readonly displayName: string;
  readonly description: string;
  readonly capabilities: ReadonlySet<ProviderCapability>;

  supports(capability: ProviderCapability): boolean;

  getAccounts(): Promise<ProviderAccount[]>;
  getBalances(): Promise<ProviderBalance[]>;
  getPositions(): Promise<ProviderPosition[]>;
  getOrders(params?: {
    status?: 'open' | 'closed' | 'all';
  }): Promise<ProviderOrder[]>;
  getFills(): Promise<ProviderFill[]>;
  getMarketData(symbols: string[]): Promise<MarketTicker[]>;
  getPortfolioSnapshot(): Promise<PortfolioSnapshot>;

  placeOrder(input: PlaceOrderInput): Promise<ProviderOrder>;
  cancelOrder(orderId: string): Promise<ProviderOrder>;

  /**
   * Connect / update API credentials for this provider.
   * Secrets must never be stored in client-only storage in production —
   * this signature is the integration seam for a future secure backend.
   */
  connect(credentials: {
    apiKey: string;
    apiSecret: string;
    environment?: string;
  }): Promise<ProviderAccount>;

  disconnect(): Promise<void>;
}
