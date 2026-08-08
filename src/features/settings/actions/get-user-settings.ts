'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import type { UserSettings } from '@/features/settings/types';
import { requireAuth } from '@/features/auth/session';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getUserSettingsAction(): Promise<
  ActionResult<UserSettings>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<UserSettings>>(
      '/user/settings',
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load settings.');
  }
}
