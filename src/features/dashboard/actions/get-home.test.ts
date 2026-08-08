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

import { getHomeAction } from '@/features/dashboard/actions/get-home';

describe('getHomeAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads the home dashboard', async () => {
    const data = { portfolio: null, accounts: [] };
    apiGet.mockResolvedValue({ data });
    await expect(getHomeAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/home', { token: 'token-1' });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Failed', 500));
    await expect(getHomeAction()).resolves.toMatchObject({
      ok: false,
      message: 'Failed',
    });
  });
});
