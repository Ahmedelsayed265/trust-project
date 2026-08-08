import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PROVIDER_ID,
  getProvider,
  listProviders,
} from '@/shared/trading/registry';

describe('trading registry', () => {
  it('defaults to binance-spot', () => {
    expect(DEFAULT_PROVIDER_ID).toBe('binance-spot');
  });

  it('returns provider instances by id', () => {
    expect(getProvider('binance-spot').id).toBe('binance-spot');
    expect(getProvider('alpaca').id).toBe('alpaca');
  });

  it('lists every registered provider', () => {
    const ids = listProviders().map((provider) => provider.id);
    expect(ids).toEqual(expect.arrayContaining(['binance-spot', 'alpaca']));
    expect(ids).toHaveLength(2);
  });
});
