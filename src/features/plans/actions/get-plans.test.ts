import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();
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
      get: (...args: unknown[]) => apiGet(...args),
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

import {
  cancelSubscriptionAction,
  getPlansAction,
  subscribePlanAction,
} from '@/features/plans/actions/get-plans';

describe('getPlansAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads plans', async () => {
    const data = { items: [] };
    apiGet.mockResolvedValue({ data });
    await expect(getPlansAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/plans', { token: 'token-1' });
  });
});

describe('subscribePlanAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('requires a plan key', async () => {
    await expect(
      subscribePlanAction({ plan_key: '  ', billing_cycle: 'monthly' }),
    ).resolves.toEqual({ ok: false, message: 'Plan key is required.' });
  });

  it('subscribes with defaults', async () => {
    apiPost.mockResolvedValue({ data: { status: 'active' } });
    await expect(
      subscribePlanAction({
        plan_key: ' signal-guard ',
        billing_cycle: 'yearly',
      }),
    ).resolves.toEqual({ ok: true, data: { status: 'active' } });

    expect(apiPost).toHaveBeenCalledWith(
      '/user/plans/subscribe',
      {
        plan_key: 'signal-guard',
        billing_cycle: 'yearly',
        auto_renew: true,
      },
      { token: 'token-1' },
    );
  });
});

describe('cancelSubscriptionAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('cancels the current subscription', async () => {
    apiPost.mockResolvedValue({ data: { status: 'cancelled' } });
    await expect(cancelSubscriptionAction()).resolves.toEqual({
      ok: true,
      data: { status: 'cancelled' },
    });
    expect(apiPost).toHaveBeenCalledWith('/user/plans/cancel', undefined, {
      token: 'token-1',
    });
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('No subscription', 404));
    await expect(cancelSubscriptionAction()).resolves.toMatchObject({
      ok: false,
      message: 'No subscription',
    });
  });
});
