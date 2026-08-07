'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import {
  DEFAULT_APP_SETTINGS,
  type AppSettings,
} from '@/features/app-settings/types';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getSettingsAction(): Promise<ActionResult<AppSettings>> {
  try {
    const response =
      await api.get<ApiSuccessResponse<AppSettings>>('/settings');
    return { ok: true, data: response.data ?? DEFAULT_APP_SETTINGS };
  } catch (error) {
    return mapActionError(error, 'Failed to load settings.');
  }
}
