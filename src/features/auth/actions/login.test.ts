import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiPost = vi.fn();
const setAuthToken = vi.fn();

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
  setAuthToken: (...args: unknown[]) => setAuthToken(...args),
}));

import { loginAction } from '@/features/auth/actions/login';

const verifiedUser = {
  id: 1,
  email: 'demo@trustai.app',
  email_verified: true,
  token: 'token-123',
  auth: 'Bearer',
};

describe('loginAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    setAuthToken.mockReset();
  });

  it('sets the auth cookie for verified users', async () => {
    apiPost.mockResolvedValue({ data: verifiedUser });

    const result = await loginAction({
      email: 'demo@trustai.app',
      password: 'password',
      remember: true,
    });

    expect(result).toEqual({ ok: true, data: verifiedUser });
    expect(apiPost).toHaveBeenCalledWith('/user/auth/login', {
      email: 'demo@trustai.app',
      password: 'password',
      remember: true,
      device_name: 'web',
    });
    expect(setAuthToken).toHaveBeenCalledWith('token-123', true);
  });

  it('returns unverified users without setting a session cookie', async () => {
    const unverified = { ...verifiedUser, email_verified: false };
    apiPost.mockResolvedValue({ data: unverified });

    const result = await loginAction({
      email: 'demo@trustai.app',
      password: 'password',
    });

    expect(result).toEqual({ ok: true, data: unverified });
    expect(setAuthToken).not.toHaveBeenCalled();
  });

  it('fails when the API omits a token', async () => {
    apiPost.mockResolvedValue({ data: { ...verifiedUser, token: '' } });
    const result = await loginAction({
      email: 'demo@trustai.app',
      password: 'password',
    });
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toMatch(/no token/i);
    }
  });

  it('maps API errors', async () => {
    apiPost.mockRejectedValue(new ApiError('Invalid credentials', 401));
    const result = await loginAction({
      email: 'demo@trustai.app',
      password: 'password',
    });
    expect(result).toEqual({
      ok: false,
      message: 'Invalid credentials',
      errors: undefined,
      status: 401,
    });
  });
});
