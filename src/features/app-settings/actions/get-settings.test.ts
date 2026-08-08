import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_APP_SETTINGS } from '@/features/app-settings/types';
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

import { getSettingsAction } from '@/features/app-settings/actions/get-settings';

describe('getSettingsAction', () => {
  beforeEach(() => {
    apiGet.mockReset();
  });

  it('returns API settings when present', async () => {
    const data = { ...DEFAULT_APP_SETTINGS, app_name: 'Custom' };
    apiGet.mockResolvedValue({ data });
    await expect(getSettingsAction()).resolves.toEqual({ ok: true, data });
  });

  it('falls back to defaults when data is null', async () => {
    apiGet.mockResolvedValue({ data: null });
    await expect(getSettingsAction()).resolves.toEqual({
      ok: true,
      data: DEFAULT_APP_SETTINGS,
    });
  });

  it('maps failures', async () => {
    apiGet.mockRejectedValue(new ApiError('Unavailable', 503));
    await expect(getSettingsAction()).resolves.toMatchObject({
      ok: false,
      message: 'Unavailable',
      status: 503,
    });
  });
});
