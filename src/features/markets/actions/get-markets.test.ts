import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();
const getAuthToken = vi.fn();

vi.mock('@/shared/lib/api', async () => {
  const actual =
    await vi.importActual<typeof import('@/shared/lib/api')>(
      '@/shared/lib/api',
    );
  return {
    ...actual,
    api: {
      get: (...args: unknown[]) => apiGet(...args),
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('@/features/auth/session', () => ({
  getAuthToken: (...args: unknown[]) => getAuthToken(...args),
}));

import { getMarketsAction } from '@/features/markets/actions/get-markets';

describe('getMarketsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    getAuthToken.mockReset();
    getAuthToken.mockResolvedValue('token-1');
  });

  it('clamps per_page and trims search', async () => {
    apiGet.mockResolvedValue({ data: { items: [] } });

    await getMarketsAction({
      asset_class: 'crypto',
      search: '  btc  ',
      page: 2,
      per_page: 999,
    });

    expect(apiGet).toHaveBeenCalledWith('/markets', {
      token: 'token-1',
      query: {
        asset_class: 'crypto',
        provider_id: undefined,
        search: 'btc',
        sort: undefined,
        direction: undefined,
        page: 2,
        per_page: 50,
      },
    });
  });

  it('works without a token', async () => {
    getAuthToken.mockResolvedValue(null);
    apiGet.mockResolvedValue({ data: { items: [] } });
    await getMarketsAction();
    expect(apiGet.mock.calls[0]?.[1]?.token).toBeUndefined();
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Markets down', 500));
    await expect(getMarketsAction()).resolves.toMatchObject({
      ok: false,
      message: 'Markets down',
    });
  });
});
