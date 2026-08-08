'use server';

import type { ApiSuccessResponse, UserProfile } from '@/features/auth/types';
import type { UpdateUserProfileInput } from '@/features/settings/types';
import { requireAuth } from '@/features/auth/session';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function updateUserProfileAction(
  input: UpdateUserProfileInput,
): Promise<ActionResult<UserProfile>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<UserProfile>>(
      '/user/profile',
      {
        first_name: input.first_name.trim(),
        last_name: input.last_name.trim(),
        phone: input.phone.trim(),
        country: input.country.trim().toUpperCase(),
      },
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to update profile.');
  }
}
