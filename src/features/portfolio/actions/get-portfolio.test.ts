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

import { getPortfolioAction } from '@/features/portfolio/actions/get-portfolio';

describe('getPortfolioAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('forwards provider and fresh flags', async () => {
    apiGet.mockResolvedValue({ data: { equity: 1000 } });

    await getPortfolioAction({
      provider_id: ' alpaca ',
      fresh: true,
    });

    expect(apiGet).toHaveBeenCalledWith('/user/portfolio', {
      token: 'token-1',
      query: {
        provider_id: 'alpaca',
        fresh: 1,
      },
    });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Portfolio down', 500));
    await expect(getPortfolioAction()).resolves.toMatchObject({
      ok: false,
      message: 'Portfolio down',
    });
  });
});
