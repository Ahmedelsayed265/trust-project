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

import { getFaqsAction } from '@/features/faq/actions/get-faqs';

describe('getFaqsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('loads FAQs and forwards category filters', async () => {
    const data = { items: [], categories: ['trading'] };
    apiGet.mockResolvedValue({ data });

    const result = await getFaqsAction({ category: 'trading' });
    expect(result).toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/faqs', {
      query: { category: 'trading' },
    });
  });

  it('omits empty category', async () => {
    apiGet.mockResolvedValue({ data: { items: [], categories: [] } });
    await getFaqsAction({ category: '' });
    expect(apiGet).toHaveBeenCalledWith('/faqs', {
      query: { category: undefined },
    });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Down', 500));
    const result = await getFaqsAction();
    expect(result).toMatchObject({ ok: false, message: 'Down', status: 500 });
  });
});
