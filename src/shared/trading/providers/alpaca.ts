import type { TradingProvider } from '@/shared/trading/provider';
import { PROVIDER_CAPABILITIES } from '@/shared/trading/capabilities';
import {
  ProviderError,
  type PlaceOrderInput,
  type PortfolioSnapshot,
  type ProviderAccount,
  type ProviderBalance,
  type ProviderCapability,
  type ProviderFill,
  type ProviderOrder,
  type ProviderPosition,
  type MarketTicker,
} from '@/shared/trading/types';

/**
 * Alpaca provider adapter (stocks / paper / live).
 *
 * Demo mode mirrors Alpaca account + positions + orders shapes.
 * Funding (ACH) is handled on Alpaca — this app never creates an
 * internal cash wallet or fake deposit/withdraw queue.
 */
export class AlpacaProvider implements TradingProvider {
  readonly id = 'alpaca' as const;
  readonly displayName = 'Alpaca';
  readonly description =
    'US equities via Alpaca (paper or live). Cash and positions come from your Alpaca brokerage account.';
  readonly capabilities = new Set<ProviderCapability>(
    PROVIDER_CAPABILITIES.alpaca,
  );

  private connected = true;
  private account: ProviderAccount = {
    id: 'alpaca-paper',
    providerId: 'alpaca',
    label: 'Alpaca Paper',
    environment: 'paper',
    status: 'connected',
    permissions: ['trading', 'account:read'],
    lastSyncedAt: new Date().toISOString(),
  };

  private balances: ProviderBalance[] = [
    { asset: 'USD', free: 25000, locked: 0, usdValue: 25000 },
  ];

  private positions: ProviderPosition[] = [
    {
      id: 'aapl',
      symbol: 'AAPL',
      side: 'long',
      qty: 40,
      avgEntryPrice: 178.2,
      markPrice: 189.45,
      unrealizedPnl: 450,
      marketValue: 7578,
    },
  ];

  private orders: ProviderOrder[] = [];
  private fills: ProviderFill[] = [];

  supports(capability: ProviderCapability) {
    return this.capabilities.has(capability);
  }

  private assertConnected() {
    if (!this.connected || this.account.status !== 'connected') {
      throw new ProviderError(
        'not_connected',
        'Connect Alpaca API keys (paper or live) to load brokerage data.',
        this.id,
      );
    }
  }

  async getAccounts() {
    return this.connected ? [this.account] : [];
  }

  async getBalances() {
    this.assertConnected();
    return structuredClone(this.balances);
  }

  async getPositions() {
    this.assertConnected();
    return structuredClone(this.positions);
  }

  async getOrders(params?: { status?: 'open' | 'closed' | 'all' }) {
    this.assertConnected();
    const status = params?.status ?? 'all';
    const open: ProviderOrder['status'][] = ['new', 'partially_filled'];
    return structuredClone(
      this.orders.filter((o) => {
        if (status === 'open') return open.includes(o.status);
        if (status === 'closed') return !open.includes(o.status);
        return true;
      }),
    );
  }

  async getFills() {
    this.assertConnected();
    return structuredClone(this.fills);
  }

  async getMarketData(symbols: string[]) {
    const tickers: Record<string, MarketTicker> = {
      AAPL: { symbol: 'AAPL', price: 189.45, change24hPct: 1.1 },
      NVDA: { symbol: 'NVDA', price: 875.4, change24hPct: 2.4 },
    };
    return symbols.map(
      (symbol) => tickers[symbol] ?? { symbol, price: 0, change24hPct: 0 },
    );
  }

  async getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
    this.assertConnected();
    const balances = await this.getBalances();
    const positions = await this.getPositions();
    const cash = balances.find((b) => b.asset === 'USD')?.free ?? 0;
    const positionsValue = positions.reduce((s, p) => s + p.marketValue, 0);
    const equity = cash + positionsValue;
    const openPnl = positions.reduce((s, p) => s + p.unrealizedPnl, 0);

    return {
      providerId: this.id,
      equity,
      buyingPower: cash,
      currency: 'USD',
      dayPnl: openPnl * 0.15,
      dayPnlPct: equity ? ((openPnl * 0.15) / equity) * 100 : 0,
      openPnl,
      balances,
      positions,
      asOf: new Date().toISOString(),
    };
  }

  async placeOrder(input: PlaceOrderInput): Promise<ProviderOrder> {
    this.assertConnected();
    const order: ProviderOrder = {
      id: `ap-${Date.now()}`,
      symbol: input.symbol,
      side: input.side,
      type: input.type,
      qty: input.qty,
      filledQty: input.type === 'market' ? input.qty : 0,
      limitPrice: input.limitPrice ?? null,
      avgFillPrice: input.type === 'market' ? 189.45 : null,
      status: input.type === 'market' ? 'filled' : 'new',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.orders = [order, ...this.orders];
    return order;
  }

  async cancelOrder(orderId: string): Promise<ProviderOrder> {
    this.assertConnected();
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new ProviderError('invalid_request', 'Order not found.', this.id);
    }
    order.status = 'canceled';
    order.updatedAt = new Date().toISOString();
    return structuredClone(order);
  }

  async connect(credentials: {
    apiKey: string;
    apiSecret: string;
    environment?: string;
  }) {
    if (!credentials.apiKey || !credentials.apiSecret) {
      throw new ProviderError(
        'invalid_request',
        'Alpaca API Key and Secret are required.',
        this.id,
      );
    }
    const environment = credentials.environment === 'live' ? 'live' : 'paper';
    this.connected = true;
    this.account = {
      ...this.account,
      id: environment === 'live' ? 'alpaca-live' : 'alpaca-paper',
      label: environment === 'live' ? 'Alpaca Live' : 'Alpaca Paper',
      environment,
      status: 'connected',
      permissions: ['trading', 'account:read'],
      lastSyncedAt: new Date().toISOString(),
      errorMessage: undefined,
    };
    return this.account;
  }

  async disconnect() {
    this.connected = false;
    this.account = {
      ...this.account,
      status: 'disconnected',
      permissions: [],
      lastSyncedAt: null,
    };
  }
}
