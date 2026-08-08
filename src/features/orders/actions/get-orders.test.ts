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
  cancelOrderAction,
  getOrderByIdAction,
  getOrdersAction,
} from '@/features/orders/actions/get-orders';

describe('getOrdersAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('defaults status to all and trims filters', async () => {
    const data = { items: [], summary: { total: 0 } };
    apiGet.mockResolvedValue({ data });

    await getOrdersAction({
      provider_id: ' binance-spot ',
      symbol: ' BTCUSDT ',
    });

    expect(apiGet).toHaveBeenCalledWith('/user/orders', {
      token: 'token-1',
      query: {
        status: 'all',
        provider_id: 'binance-spot',
        symbol: 'BTCUSDT',
      },
    });
  });
});

describe('getOrderByIdAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('requires an order id', async () => {
    await expect(getOrderByIdAction('   ')).resolves.toEqual({
      ok: false,
      message: 'Order id is required.',
    });
  });

  it('loads an order by id', async () => {
    apiGet.mockResolvedValue({ data: { id: 'ord-1' } });
    await expect(getOrderByIdAction('ord-1', 'alpaca')).resolves.toEqual({
      ok: true,
      data: { id: 'ord-1' },
    });
    expect(apiGet).toHaveBeenCalledWith('/user/orders/ord-1', {
      token: 'token-1',
      query: { provider_id: 'alpaca' },
    });
  });
});

describe('cancelOrderAction', () => {
  beforeEach(() => {
    apiPost.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('cancels an order', async () => {
    apiPost.mockResolvedValue({ data: { id: 'ord-1', status: 'canceled' } });
    await expect(
      cancelOrderAction({ id: 'ord-1', provider_id: 'binance-spot' }),
    ).resolves.toEqual({
      ok: true,
      data: { id: 'ord-1', status: 'canceled' },
    });
    expect(apiPost).toHaveBeenCalledWith(
      '/user/orders/ord-1/cancel',
      { provider_id: 'binance-spot' },
      { token: 'token-1' },
    );
  });

  it('maps failures', async () => {
    apiPost.mockRejectedValue(new ApiError('Already filled', 409));
    await expect(cancelOrderAction({ id: 'ord-1' })).resolves.toMatchObject({
      ok: false,
      message: 'Already filled',
      status: 409,
    });
  });
});
