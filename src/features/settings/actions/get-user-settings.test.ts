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

import { getUserSettingsAction } from '@/features/settings/actions/get-user-settings';

describe('getUserSettingsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads user settings with auth', async () => {
    const data = { display_name: 'Ammar', language: 'en' };
    apiGet.mockResolvedValue({ data });

    await expect(getUserSettingsAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/settings', { token: 'token-1' });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Denied', 403));
    await expect(getUserSettingsAction()).resolves.toMatchObject({
      ok: false,
      message: 'Denied',
      status: 403,
    });
  });
});
