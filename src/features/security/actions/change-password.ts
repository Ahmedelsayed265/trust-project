'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type { ChangePasswordValues } from '@/features/security/schemas/security';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function changePasswordAction(
  input: ChangePasswordValues,
): Promise<ActionResult<null>> {
  try {
    const token = await requireAuth();
    await api.post<ApiSuccessResponse<null>>(
      '/user/security/change-password',
      {
        current_password: input.current_password,
        password: input.password,
        password_confirmation: input.password_confirmation,
      },
      { token },
    );
    return { ok: true, data: null };
  } catch (error) {
    return mapActionError(error, 'Failed to change password.');
  }
}
