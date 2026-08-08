import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiPost = vi.fn();

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

import { registerAction } from '@/features/auth/actions/register';

const input = {
  first_name: 'Ammar',
  last_name: 'Nashat',
  email: 'demo@trustai.app',
  password: 'Password1!',
  password_confirmation: 'Password1!',
  terms: true,
};

describe('registerAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
  });

  it('returns the created user without setting a session', async () => {
    const user = { id: 1, token: 'pending-token', email_verified: false };
    apiPost.mockResolvedValue({ data: user });

    const result = await registerAction(input);
    expect(result).toEqual({ ok: true, data: user });
    expect(apiPost).toHaveBeenCalledWith('/user/auth/register', {
      ...input,
      device_name: 'web',
    });
  });

  it('fails when token is missing', async () => {
    apiPost.mockResolvedValue({ data: { id: 1 } });
    const result = await registerAction(input);
    expect(result.ok).toBe(false);
  });

  it('maps API errors', async () => {
    apiPost.mockRejectedValue(new ApiError('Email taken', 422));
    const result = await registerAction(input);
    expect(result).toMatchObject({
      ok: false,
      message: 'Email taken',
      status: 422,
    });
  });
});
