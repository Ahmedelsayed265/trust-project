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
  getReferralsAction,
  inviteByEmailAction,
} from '@/features/invite/actions/referrals';

describe('getReferralsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads referrals', async () => {
    const data = { invites: [] };
    apiGet.mockResolvedValue({ data });
    await expect(getReferralsAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/referrals', {
      token: 'token-1',
    });
  });
});

describe('inviteByEmailAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('trims email and optional name', async () => {
    apiPost.mockResolvedValue({ data: { email: 'friend@trustai.app' } });

    await inviteByEmailAction({
      email: ' friend@trustai.app ',
      name: ' Friend ',
    });

    expect(apiPost).toHaveBeenCalledWith(
      '/user/referrals/invite',
      { email: 'friend@trustai.app', name: 'Friend' },
      { token: 'token-1' },
    );
  });

  it('omits blank names', async () => {
    apiPost.mockResolvedValue({ data: { email: 'friend@trustai.app' } });
    await inviteByEmailAction({ email: 'friend@trustai.app', name: '   ' });
    expect(apiPost).toHaveBeenCalledWith(
      '/user/referrals/invite',
      { email: 'friend@trustai.app' },
      { token: 'token-1' },
    );
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('Already invited', 422));
    await expect(
      inviteByEmailAction({ email: 'friend@trustai.app' }),
    ).resolves.toMatchObject({ ok: false, message: 'Already invited' });
  });
});
