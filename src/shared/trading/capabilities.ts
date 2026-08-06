import type { ProviderCapability, ProviderId } from '@/shared/trading/types';

/**
 * Explicit capability matrix. Features not listed must be hidden or
 * shown as unsupported — never faked as in-app wallet flows.
 */
export const PROVIDER_CAPABILITIES: Record<
  ProviderId,
  readonly ProviderCapability[]
> = {
  'binance-spot': [
    'spotTrading',
    'marketOrders',
    'limitOrders',
    'cancelOrders',
    'readBalances',
    'readPositions',
    'readOrders',
    'readFills',
    'marketData',
    // Deposit/withdraw happen on Binance.com — not via this app.
  ],
  alpaca: [
    'stockTrading',
    'paperTrading',
    'marketOrders',
    'limitOrders',
    'cancelOrders',
    'readBalances',
    'readPositions',
    'readOrders',
    'readFills',
    'marketData',
    // Funding is Alpaca's ACH / banking rail — not an in-app wallet.
  ],
} as const;

export function providerSupports(
  providerId: ProviderId,
  capability: ProviderCapability,
) {
  return PROVIDER_CAPABILITIES[providerId].includes(capability);
}
