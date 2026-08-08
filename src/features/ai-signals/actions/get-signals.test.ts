import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();
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
      post: vi.fn(),
      put: vi.fn(),
      patch: vi.fn(),
      delete: vi.fn(),
    },
  };
});

vi.mock('@/features/auth/session', () => ({
  requireAuth: (...args: unknown[]) => requireAuth(...args),
}));

import { getSignalsAction } from '@/features/ai-signals/actions/get-signals';

describe('getSignalsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('forwards filters and clamps per_page', async () => {
    apiGet.mockResolvedValue({ data: { items: [] } });

    await getSignalsAction({
      status: 'active',
      side: 'buy',
      strength: 'strong',
      symbol: ' BTC ',
      per_page: 500,
      page: 1,
    });

    expect(apiGet).toHaveBeenCalledWith('/signals', {
      token: 'token-1',
      query: {
        status: 'active',
        side: 'buy',
        strength: 'strong',
        symbol: 'BTC',
        asset_class: undefined,
        page: 1,
        per_page: 100,
      },
    });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Signals down', 500));
    await expect(getSignalsAction()).resolves.toMatchObject({
      ok: false,
      message: 'Signals down',
    });
  });
});
