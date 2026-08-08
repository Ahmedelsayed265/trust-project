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

import { updateUserProfileAction } from '@/features/settings/actions/update-user-profile';

describe('updateUserProfileAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('trims and uppercases country before posting', async () => {
    const profile = { id: 1, first_name: 'Ammar' };
    apiPost.mockResolvedValue({ data: profile });

    const result = await updateUserProfileAction({
      first_name: ' Ammar ',
      last_name: ' Nashat ',
      phone: ' +201000000000 ',
      country: ' eg ',
    });

    expect(result).toEqual({ ok: true, data: profile });
    expect(apiPost).toHaveBeenCalledWith(
      '/user/profile',
      {
        first_name: 'Ammar',
        last_name: 'Nashat',
        phone: '+201000000000',
        country: 'EG',
      },
      { token: 'token-1' },
    );
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('Bad phone', 422));
    await expect(
      updateUserProfileAction({
        first_name: 'A',
        last_name: 'B',
        phone: '1',
        country: 'EG',
      }),
    ).resolves.toMatchObject({ ok: false, message: 'Bad phone' });
  });
});
