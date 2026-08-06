'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  DEFAULT_PROVIDER_ID,
  getProvider,
  listProviders,
} from '@/shared/trading/registry';
import type { TradingProvider } from '@/shared/trading/provider';
import type {
  PortfolioSnapshot,
  ProviderAccount,
  ProviderCapability,
  ProviderId,
  ProviderOrder,
  ProviderPosition,
} from '@/shared/trading/types';
import { ProviderError } from '@/shared/trading/types';

const ACTIVE_KEY = 'trustai-active-provider';

type TradingContextValue = {
  providers: TradingProvider[];
  activeProviderId: ProviderId;
  activeProvider: TradingProvider;
  setActiveProviderId: (id: ProviderId) => void;
  accounts: ProviderAccount[];
  snapshot: PortfolioSnapshot | null;
  positions: ProviderPosition[];
  openOrders: ProviderOrder[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  connect: (
    id: ProviderId,
    credentials: { apiKey: string; apiSecret: string; environment?: string },
  ) => Promise<void>;
  disconnect: (id: ProviderId) => Promise<void>;
  supports: (capability: ProviderCapability) => boolean;
};

const TradingContext = createContext<TradingContextValue | null>(null);

function readStoredProviderId(): ProviderId {
  if (typeof window === 'undefined') return DEFAULT_PROVIDER_ID;
  const stored = localStorage.getItem(ACTIVE_KEY);
  if (stored === 'binance-spot' || stored === 'alpaca') return stored;
  return DEFAULT_PROVIDER_ID;
}

export function TradingProviderContext({ children }: { children: ReactNode }) {
  const providers = useMemo(() => listProviders(), []);
  const [activeProviderId, setActiveProviderIdState] =
    useState<ProviderId>(readStoredProviderId);
  const [accounts, setAccounts] = useState<ProviderAccount[]>([]);
  const [snapshot, setSnapshot] = useState<PortfolioSnapshot | null>(null);
  const [positions, setPositions] = useState<ProviderPosition[]>([]);
  const [openOrders, setOpenOrders] = useState<ProviderOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const activeProvider = getProvider(activeProviderId);

  const setActiveProviderId = useCallback((id: ProviderId) => {
    setActiveProviderIdState(id);
    localStorage.setItem(ACTIVE_KEY, id);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    const provider = getProvider(activeProviderId);
    try {
      const nextAccounts = await provider.getAccounts();
      setAccounts(nextAccounts);

      const connected = nextAccounts.some((a) => a.status === 'connected');

      // Demo adapters always expose seed balances for UI. If the account is
      // disconnected, auto-use demo credentials so the dashboard isn't empty.
      if (!connected) {
        await provider.connect({
          apiKey: 'demo',
          apiSecret: 'demo',
          environment: activeProviderId === 'alpaca' ? 'paper' : 'live',
        });
      }

      const [nextSnapshot, nextPositions, nextOrders, refreshedAccounts] =
        await Promise.all([
          provider.getPortfolioSnapshot(),
          provider.getPositions(),
          provider.getOrders({ status: 'open' }),
          provider.getAccounts(),
        ]);
      setAccounts(refreshedAccounts);
      setSnapshot(nextSnapshot);
      setPositions(nextPositions);
      setOpenOrders(nextOrders);
    } catch (err) {
      const message =
        err instanceof ProviderError
          ? err.message
          : 'Failed to sync provider account.';
      setError(message);
      setSnapshot(null);
      setPositions([]);
      setOpenOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeProviderId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const connect = useCallback(
    async (
      id: ProviderId,
      credentials: { apiKey: string; apiSecret: string; environment?: string },
    ) => {
      const provider = getProvider(id);
      await provider.connect(credentials);
      setActiveProviderId(id);
      await refresh();
    },
    [refresh, setActiveProviderId],
  );

  const disconnect = useCallback(
    async (id: ProviderId) => {
      await getProvider(id).disconnect();
      await refresh();
    },
    [refresh],
  );

  const supports = useCallback(
    (capability: ProviderCapability) => activeProvider.supports(capability),
    [activeProvider],
  );

  const value = useMemo(
    () => ({
      providers,
      activeProviderId,
      activeProvider,
      setActiveProviderId,
      accounts,
      snapshot,
      positions,
      openOrders,
      loading,
      error,
      refresh,
      connect,
      disconnect,
      supports,
    }),
    [
      providers,
      activeProviderId,
      activeProvider,
      setActiveProviderId,
      accounts,
      snapshot,
      positions,
      openOrders,
      loading,
      error,
      refresh,
      connect,
      disconnect,
      supports,
    ],
  );

  return (
    <TradingContext.Provider value={value}>{children}</TradingContext.Provider>
  );
}

export function useTrading() {
  const ctx = useContext(TradingContext);
  if (!ctx) {
    throw new Error('useTrading must be used within TradingProviderContext');
  }
  return ctx;
}
