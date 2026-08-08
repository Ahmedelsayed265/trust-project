import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const getHelpAction = vi.fn();

vi.mock('@/features/help/actions/get-help', () => ({
  getHelpAction: (...args: unknown[]) => getHelpAction(...args),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}));

import { useHelpList } from '@/features/help/hooks/use-help-list';

const initialData = {
  items: [
    {
      id: 1,
      slug: 'a',
      title: 'A',
      excerpt: 'e',
      category: 'trading',
      icon: 'Rocket',
      views: 1,
    },
  ],
  categories: ['trading', 'billing'],
};

describe('useHelpList', () => {
  beforeEach(() => {
    getHelpAction.mockReset();
    getHelpAction.mockResolvedValue({
      ok: true,
      data: {
        items: [
          {
            id: 2,
            slug: 'b',
            title: 'B',
            excerpt: 'e',
            category: 'billing',
            icon: 'CreditCard',
            views: 0,
          },
        ],
        categories: ['billing'],
      },
    });
  });

  it('refetches when category changes', async () => {
    const { result } = renderHook(() => useHelpList(initialData));

    act(() => {
      result.current.changeCategory('billing');
    });

    await waitFor(() => {
      expect(getHelpAction).toHaveBeenCalledWith({
        category: 'billing',
        search: undefined,
      });
    });

    await waitFor(() => {
      expect(result.current.items[0]?.slug).toBe('b');
    });
  });

  it('applies trimmed search on submit', async () => {
    const { result } = renderHook(() => useHelpList(initialData));

    act(() => {
      result.current.setSearchDraft('  orders  ');
    });

    act(() => {
      result.current.applySearch({
        preventDefault: () => undefined,
      } as React.FormEvent);
    });

    await waitFor(() => {
      expect(getHelpAction).toHaveBeenCalledWith({
        category: undefined,
        search: 'orders',
      });
    });
  });
});
