import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();
const apiPost = vi.fn();
const apiDelete = vi.fn();
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
      post: (...args: unknown[]) => apiPost(...args),
      put: vi.fn(),
      patch: vi.fn(),
      delete: (...args: unknown[]) => apiDelete(...args),
    },
  };
});

vi.mock('@/features/auth/session', () => ({
  requireAuth: (...args: unknown[]) => requireAuth(...args),
}));

import {
  connectAccountAction,
  disconnectAccountAction,
  getAccountsAction,
  getProvidersAction,
} from '@/features/accounts/actions/accounts';

describe('getProvidersAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('loads the public provider catalog', async () => {
    const data = [{ id: 'binance-spot', display_name: 'Binance Spot' }];
    apiGet.mockResolvedValue({ data });
    await expect(getProvidersAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/providers');
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Down', 500));
    await expect(getProvidersAction()).resolves.toMatchObject({
      ok: false,
      message: 'Down',
    });
  });
});

describe('getAccountsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads accounts with auth', async () => {
    const data = { accounts: [], mode: 'demo' };
    apiGet.mockResolvedValue({ data });
    await expect(getAccountsAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/accounts', { token: 'token-1' });
  });
});

describe('connectAccountAction / disconnectAccountAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    apiDelete.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('connects a provider', async () => {
    const account = { provider_id: 'alpaca', is_connected: true };
    apiPost.mockResolvedValue({ data: account });

    const result = await connectAccountAction({
      provider_id: 'alpaca',
      api_key: 'key',
      api_secret: 'secret',
      environment: 'paper',
    });

    expect(result).toEqual({ ok: true, data: account });
    expect(apiPost).toHaveBeenCalledWith(
      '/user/accounts/connect',
      {
        provider_id: 'alpaca',
        api_key: 'key',
        api_secret: 'secret',
        environment: 'paper',
      },
      { token: 'token-1' },
    );
  });

  it('disconnects a provider', async () => {
    const account = { provider_id: 'alpaca', is_connected: false };
    apiDelete.mockResolvedValue({ data: account });
    await expect(disconnectAccountAction('alpaca')).resolves.toEqual({
      ok: true,
      data: account,
    });
    expect(apiDelete).toHaveBeenCalledWith('/user/accounts/alpaca', undefined, {
      token: 'token-1',
    });
  });
});
