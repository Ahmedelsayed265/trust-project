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
  getNewsAction,
  getNewsBySlugAction,
} from '@/features/news/actions/get-news';

describe('getNewsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('clamps per_page and trims search/symbol', async () => {
    const data = { items: [], tags: [], pagination: { current_page: 1 } };
    apiGet.mockResolvedValue({ data });

    await getNewsAction({
      tag: 'markets',
      symbol: ' BTC ',
      search: '  fed  ',
      page: 2,
      per_page: 500,
    });

    expect(apiGet).toHaveBeenCalledWith('/news', {
      query: {
        tag: 'markets',
        symbol: 'BTC',
        search: 'fed',
        page: 2,
        per_page: 100,
      },
    });
  });

  it('defaults per_page to 15', async () => {
    apiGet.mockResolvedValue({ data: { items: [], tags: [], pagination: {} } });
    await getNewsAction();
    expect(apiGet.mock.calls[0]?.[1]?.query?.per_page).toBe(15);
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('News down', 500));
    await expect(getNewsAction()).resolves.toMatchObject({
      ok: false,
      message: 'News down',
    });
  });
});

describe('getNewsBySlugAction', () => {
  it('loads an article by slug', async () => {
    apiGet.mockResolvedValue({ data: { slug: 'fed-cut' } });
    await expect(getNewsBySlugAction('fed-cut')).resolves.toEqual({
      ok: true,
      data: { slug: 'fed-cut' },
    });
    expect(apiGet).toHaveBeenCalledWith('/news/fed-cut');
  });
});
