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

import { changePasswordAction } from '@/features/security/actions/change-password';

const input = {
  current_password: 'OldPass1!',
  password: 'NewPass1!',
  password_confirmation: 'NewPass1!',
};

describe('changePasswordAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('posts the password change payload', async () => {
    apiPost.mockResolvedValue({ data: null });
    await expect(changePasswordAction(input)).resolves.toEqual({
      ok: true,
      data: null,
    });
    expect(apiPost).toHaveBeenCalledWith(
      '/user/security/change-password',
      input,
      { token: 'token-1' },
    );
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('Wrong password', 422));
    await expect(changePasswordAction(input)).resolves.toMatchObject({
      ok: false,
      message: 'Wrong password',
    });
  });
});
