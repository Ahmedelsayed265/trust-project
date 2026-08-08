import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();
const apiPost = vi.fn();
const requireAuth = vi.fn();

vi.mock('@/shared/lib/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/shared/lib/api')>(
      '@/shared/lib/api',
    );
  return {
    ...actual,
    api: {
      get: (...args: unknown[]) => apiGet(...args),
      post: (...args: unknown[]) => apiPost(...args),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('@/features/auth/session', () => ({
  requireAuth: (...args: unknown[]) => requireAuth(...args),
}));

import {
  addToWatchlistAction,
  getWatchlistAction,
} from '@/features/watchlist/actions/watchlist';

describe('getWatchlistAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads the watchlist', async () => {
    const data = { items: [] };
    apiGet.mockResolvedValue({ data });
    await expect(getWatchlistAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/watchlist', {
      token: 'token-1',
    });
  });
});

describe('addToWatchlistAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('normalizes symbols before posting', async () => {
    const item = { symbol: 'BTCUSDT' };
    apiPost.mockResolvedValue({ data: item });

    const result = await addToWatchlistAction({
      symbol: ' btc/usdt ',
      alert_above: 70000,
    });

    expect(result).toEqual({ ok: true, data: item });
    expect(apiPost).toHaveBeenCalledWith(
      '/user/watchlist',
      {
        symbol: 'BTCUSDT',
        alert_above: 70000,
        alert_below: undefined,
      },
      { token: 'token-1' },
    );
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('Exists', 422));
    await expect(
      addToWatchlistAction({ symbol: 'ETHUSDT' }),
    ).resolves.toMatchObject({ ok: false, message: 'Exists' });
  });
});
