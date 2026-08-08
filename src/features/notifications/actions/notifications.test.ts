import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();
const requireAuth = vi.fn();
const getCurrentUser = vi.fn();

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

vi.mock('@/features/auth/get-current-user', () => ({
  getCurrentUser: (...args: unknown[]) => getCurrentUser(...args),
}));

import { getNotificationsAction } from '@/features/notifications/actions/notifications';

describe('getNotificationsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    getCurrentUser.mockReset();
    requireAuth.mockResolvedValue('token-1');
    getCurrentUser.mockResolvedValue({ language: 'en' });
  });

  it('loads notifications with lang header and clamped page size', async () => {
    apiGet.mockResolvedValue({ data: { items: [] } });

    await getNotificationsAction({
      page: 2,
      per_page: 500,
      unread: true,
      type: 'system',
    });

    expect(apiGet).toHaveBeenCalledWith('/user/notifications', {
      token: 'token-1',
      headers: { lang: 'en' },
      query: {
        page: 2,
        per_page: 100,
        type: 'system',
        unread: 1,
      },
    });
  });

  it('continues without lang header when user lookup fails', async () => {
    getCurrentUser.mockRejectedValue(new Error('no user'));
    apiGet.mockResolvedValue({ data: { items: [] } });

    await getNotificationsAction();
    expect(apiGet.mock.calls[0]?.[1]?.headers).toBeUndefined();
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Notifications down', 500));
    await expect(getNotificationsAction()).resolves.toMatchObject({
      ok: false,
      message: 'Notifications down',
    });
  });
});
