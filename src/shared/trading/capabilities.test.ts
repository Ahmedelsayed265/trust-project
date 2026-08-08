import { describe, expect, it } from 'vitest';
import {
  PROVIDER_CAPABILITIES,
  providerSupports,
} from '@/shared/trading/capabilities';

describe('providerSupports', () => {
  it('returns true for listed capabilities', () => {
    expect(providerSupports('binance-spot', 'spotTrading')).toBe(true);
    expect(providerSupports('alpaca', 'paperTrading')).toBe(true);
    expect(providerSupports('alpaca', 'stockTrading')).toBe(true);
  });

  it('returns false for capabilities outside the matrix', () => {
    expect(providerSupports('binance-spot', 'paperTrading')).toBe(false);
    expect(providerSupports('alpaca', 'spotTrading')).toBe(false);
  });

  it('keeps both providers able to place market and limit orders', () => {
    for (const id of Object.keys(PROVIDER_CAPABILITIES) as Array<
      keyof typeof PROVIDER_CAPABILITIES
    >) {
      expect(providerSupports(id, 'marketOrders')).toBe(true);
      expect(providerSupports(id, 'limitOrders')).toBe(true);
    }
  });
});
