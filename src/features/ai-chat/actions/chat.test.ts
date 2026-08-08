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
  getChatListAction,
  getChatSuggestionsAction,
} from '@/features/ai-chat/actions/chat';

describe('getChatListAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads conversations with default per_page', async () => {
    const data = { items: [], suggestions: [] };
    apiGet.mockResolvedValue({ data });

    await expect(getChatListAction()).resolves.toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/user/chat', {
      token: 'token-1',
      query: { per_page: 20, page: undefined },
    });
  });
});

describe('getChatSuggestionsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
    requireAuth.mockReset();
    requireAuth.mockResolvedValue('token-1');
  });

  it('loads suggestions', async () => {
    const data = { greeting: 'Hi', suggestions: ['Show portfolio'] };
    apiGet.mockResolvedValue({ data });
    await expect(getChatSuggestionsAction()).resolves.toEqual({
      ok: true,
      data,
    });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Chat down', 500));
    await expect(getChatSuggestionsAction()).resolves.toMatchObject({
      ok: false,
      message: 'Chat down',
    });
  });
});
