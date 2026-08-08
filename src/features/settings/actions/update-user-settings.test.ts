import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

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
      get: vi.fn(),
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

import { updateUserSettingsAction } from '@/features/settings/actions/update-user-settings';

const input = {
  display_name: 'Ammar Nashat',
  language: 'en',
  currency: 'USD',
  email_alerts: true,
  push_alerts: false,
  ai_digest: true,
};

describe('updateUserSettingsAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('posts settings with the auth token', async () => {
    apiPost.mockResolvedValue({ data: input });
    const result = await updateUserSettingsAction(input);

    expect(result).toEqual({ ok: true, data: input });
    expect(apiPost).toHaveBeenCalledWith('/user/settings', input, {
      token: 'token-1',
    });
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('Invalid', 422));
    await expect(updateUserSettingsAction(input)).resolves.toMatchObject({
      ok: false,
      message: 'Invalid',
      status: 422,
    });
  });
});
