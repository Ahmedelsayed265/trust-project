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
  getCalendarAction,
  getCalendarUpcomingAction,
} from '@/features/calendar/actions/get-calendar';

describe('getCalendarAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('forwards month and filters', async () => {
    const data = { month: '2026-08', items: [] };
    apiGet.mockResolvedValue({ data });

    const result = await getCalendarAction({
      month: '2026-08',
      category: 'economic',
      impact: 'high',
    });

    expect(result).toEqual({ ok: true, data });
    expect(apiGet).toHaveBeenCalledWith('/calendar', {
      query: {
        month: '2026-08',
        from: undefined,
        to: undefined,
        impact: 'high',
        category: 'economic',
      },
    });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Calendar down', 500));
    await expect(getCalendarAction()).resolves.toMatchObject({
      ok: false,
      message: 'Calendar down',
    });
  });
});

describe('getCalendarUpcomingAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('clamps limit between 1 and 50', async () => {
    apiGet.mockResolvedValue({ data: [] });
    await getCalendarUpcomingAction({ limit: 999 });
    expect(apiGet).toHaveBeenCalledWith('/calendar/upcoming', {
      query: { limit: 50 },
    });
  });
});
