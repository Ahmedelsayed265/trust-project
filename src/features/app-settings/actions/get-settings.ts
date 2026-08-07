'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import {
  DEFAULT_APP_SETTINGS,
  type AppSettings,
} from '@/features/app-settings/types';
import { api, ApiError, type ActionResult } from '@/shared/lib/api';

function mapError(error: unknown, fallback: string): ActionResult<never> {
  if (error instanceof ApiError) {
    return {
      ok: false,
      message: error.message || fallback,
      errors: error.errors,
      status: error.status,
    };
  }

  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}

export async function getSettingsAction(): Promise<ActionResult<AppSettings>> {
  try {
    const response =
      await api.get<ApiSuccessResponse<AppSettings>>('/settings');
    return { ok: true, data: response.data ?? DEFAULT_APP_SETTINGS };
  } catch (error) {
    return mapError(error, 'Failed to load settings.');
  }
}
