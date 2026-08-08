'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  UpdateUserSettingsInput,
  UserSettings,
} from '@/features/settings/types';
import { requireAuth } from '@/features/auth/session';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function updateUserSettingsAction(
  input: UpdateUserSettingsInput,
): Promise<ActionResult<UserSettings>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<UserSettings>>(
      '/user/settings',
      {
        display_name: input.display_name,
        language: input.language,
        currency: input.currency,
        email_alerts: input.email_alerts,
        push_alerts: input.push_alerts,
        ai_digest: input.ai_digest,
      },
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to save settings.');
  }
}
