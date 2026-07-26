import type { TradingProvider } from "@/shared/trading/provider";
import { PROVIDER_CAPABILITIES } from "@/shared/trading/capabilities";
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
} from "@/shared/trading/types";

/**
 * Binance Spot provider adapter.
 *
 * Demo mode returns read-shaped snapshots that mirror Binance Spot account
 * endpoints (balances free/locked, spot holdings). It does NOT implement an
 * in-app custodial wallet, deposit address, or internal ledger.
 *
 * Production: replace seed reads with signed REST calls to api.binance.com
 * (account, openOrders, order, ticker/price) via a secure backend.
 */
export class BinanceSpotProvider implements TradingProvider {
  readonly id = "binance-spot" as const;
  readonly displayName = "Binance Spot";
  readonly description =
    "Crypto spot trading via your Binance Spot account. Balances and orders come from Binance only.";
  readonly capabilities = new Set<ProviderCapability>(
    PROVIDER_CAPABILITIES["binance-spot"]
  );

  private connected = true;
  private account: ProviderAccount = {
    id: "binance-spot-main",
    providerId: "binance-spot",
    label: "Binance Spot",
    environment: "live",
    status: "connected",
    permissions: ["spot.trade", "spot.read"],
    lastSyncedAt: new Date().toISOString(),
  };

  private balances: ProviderBalance[] = [
    { asset: "USDT", free: 8642.21, locked: 1200.0, usdValue: 9842.21 },
    { asset: "BTC", free: 0.1842, locked: 0, usdValue: 12420.5 },
    { asset: "ETH", free: 1.25, locked: 0.1, usdValue: 4267.74 },
  ];

  private positions: ProviderPosition[] = [
    {
      id: "btc-spot",
      symbol: "BTCUSDT",
      side: "long",
      qty: 0.1842,
      avgEntryPrice: 64210.0,
      markPrice: 67432.1,
      unrealizedPnl: 593.51,
      marketValue: 12420.5,
    },
    {
      id: "eth-spot",
      symbol: "ETHUSDT",
      side: "long",
      qty: 1.35,
      avgEntryPrice: 3180.0,
      markPrice: 3412.2,
      unrealizedPnl: 313.47,
      marketValue: 4606.47,
    },
  ];

  private orders: ProviderOrder[] = [
    {
      id: "bn-1001",
      symbol: "BTCUSDT",
      side: "buy",
      type: "limit",
      qty: 0.02,
      filledQty: 0,
      limitPrice: 65000,
      avgFillPrice: null,
      status: "new",
      createdAt: new Date(Date.now() - 3600_000).toISOString(),
      updatedAt: new Date(Date.now() - 3600_000).toISOString(),
    },
  ];

  private fills: ProviderFill[] = [
    {
      id: "bn-f-1",
      orderId: "bn-998",
      symbol: "ETHUSDT",
      side: "buy",
      qty: 0.85,
      price: 3412.2,
      fee: 1.45,
      feeAsset: "USDT",
      createdAt: new Date(Date.now() - 18 * 60_000).toISOString(),
    },
  ];

  supports(capability: ProviderCapability) {
    return this.capabilities.has(capability);
  }

  private assertConnected() {
    if (!this.connected || this.account.status !== "connected") {
      throw new ProviderError(
        "not_connected",
        "Connect your Binance Spot API keys to load account data.",
        this.id
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

  async getOrders(params?: { status?: "open" | "closed" | "all" }) {
    this.assertConnected();
    const status = params?.status ?? "all";
    const open: ProviderOrder["status"][] = ["new", "partially_filled"];
    return structuredClone(
      this.orders.filter((o) => {
        if (status === "open") return open.includes(o.status);
        if (status === "closed") return !open.includes(o.status);
        return true;
      })
    );
  }

  async getFills() {
    this.assertConnected();
    return structuredClone(this.fills);
  }

  async getMarketData(symbols: string[]) {
    const tickers: Record<string, MarketTicker> = {
      BTCUSDT: {
        symbol: "BTCUSDT",
        price: 67432.1,
        change24hPct: 1.25,
        high24h: 68210,
        low24h: 66120,
        volume24h: 28410,
      },
      ETHUSDT: {
        symbol: "ETHUSDT",
        price: 3412.2,
        change24hPct: 0.84,
      },
    };
    return symbols.map(
      (symbol) =>
        tickers[symbol] ?? {
          symbol,
          price: 0,
          change24hPct: 0,
        }
    );
  }

  async getPortfolioSnapshot(): Promise<PortfolioSnapshot> {
    this.assertConnected();
    const balances = await this.getBalances();
    const positions = await this.getPositions();
    const equity = balances.reduce((sum, b) => sum + (b.usdValue ?? 0), 0);
    const usdt = balances.find((b) => b.asset === "USDT");
    const buyingPower = usdt?.free ?? 0;
    const openPnl = positions.reduce((sum, p) => sum + p.unrealizedPnl, 0);
    const dayPnl = 320.45;
    const dayPnlPct = equity ? (dayPnl / equity) * 100 : 0;

    return {
      providerId: this.id,
      equity,
      buyingPower,
      currency: "USDT",
      dayPnl,
      dayPnlPct,
      openPnl,
      balances,
      positions,
      asOf: new Date().toISOString(),
    };
  }

  async placeOrder(input: PlaceOrderInput): Promise<ProviderOrder> {
    this.assertConnected();
    if (!this.supports(input.type === "market" ? "marketOrders" : "limitOrders")) {
      throw new ProviderError("unsupported", "Order type not supported.", this.id);
    }
    const order: ProviderOrder = {
      id: `bn-${Date.now()}`,
      symbol: input.symbol,
      side: input.side,
      type: input.type,
      qty: input.qty,
      filledQty: input.type === "market" ? input.qty : 0,
      limitPrice: input.limitPrice ?? null,
      avgFillPrice: input.type === "market" ? 67432.1 : null,
      status: input.type === "market" ? "filled" : "new",
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
      throw new ProviderError("invalid_request", "Order not found.", this.id);
    }
    order.status = "canceled";
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
        "invalid_request",
        "API Key and Secret are required.",
        this.id
      );
    }
    this.connected = true;
    this.account = {
      ...this.account,
      status: "connected",
      environment: credentials.environment ?? "live",
      lastSyncedAt: new Date().toISOString(),
      errorMessage: undefined,
    };
    return this.account;
  }

  async disconnect() {
    this.connected = false;
    this.account = {
      ...this.account,
      status: "disconnected",
      lastSyncedAt: null,
    };
  }
}
