import type { TradingProvider } from "@/shared/trading/provider";
import type { ProviderId } from "@/shared/trading/types";
import { BinanceSpotProvider } from "@/shared/trading/providers/binance-spot";
import { AlpacaProvider } from "@/shared/trading/providers/alpaca";

const providers: Record<ProviderId, TradingProvider> = {
  "binance-spot": new BinanceSpotProvider(),
  alpaca: new AlpacaProvider(),
};

export function getProvider(id: ProviderId): TradingProvider {
  return providers[id];
}

export function listProviders(): TradingProvider[] {
  return Object.values(providers);
}

export const DEFAULT_PROVIDER_ID: ProviderId = "binance-spot";
