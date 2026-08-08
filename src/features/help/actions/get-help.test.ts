import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ApiError } from '@/shared/lib/api/types';

const apiGet = vi.fn();

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

import {
  getHelpAction,
  getHelpBySlugAction,
} from '@/features/help/actions/get-help';

describe('getHelpAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('trims search and forwards filters', async () => {
    const data = { items: [], categories: ['trading'] };
    apiGet.mockResolvedValue({ data });

    const result = await getHelpAction({
      category: 'trading',
      search: '  orders  ',
    });

    expect(result).toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/help', {
      query: { category: 'trading', search: 'orders' },
    });
  });

  it('maps list failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Nope', 500));
    await expect(getHelpAction()).resolves.toMatchObject({
      ok: false,
      message: 'Nope',
    });
  });
});

describe('getHelpBySlugAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('loads a single article by slug', async () => {
    const article = { id: 1, slug: 'placing-your-first-order', title: 'Guide' };
    apiGet.mockResolvedValue({ data: article });

    await expect(
      getHelpBySlugAction('placing-your-first-order'),
    ).resolves.toEqual({ ok: true, data: article });
    expect(apiGet).toHaveBeenCalledWith('/help/placing-your-first-order');
  });
});
