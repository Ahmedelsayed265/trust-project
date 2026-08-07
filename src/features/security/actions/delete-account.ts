'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { redirect } from 'next/navigation';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import { clearAuthToken, requireAuth } from '@/features/auth/session';
import {
  clearPendingPasswordReset,
  clearPendingVerification,
} from '@/features/auth/pending-session';

export async function deleteAccountAction(input: {
  password: string;
}): Promise<ActionResult<null>> {
  const password = input.password.trim();
  if (!password) {
    return { ok: false, message: 'Enter your password to continue.' };
  }

  const token = await requireAuth();

  try {
    await api.delete<ApiSuccessResponse<null>>(
      '/user/profile',
      { password },
      { token },
    );
  } catch (error) {
    return mapActionError(error, 'Failed to delete account.', {
      message: (err) =>
        err.status === 422
          ? err.message || 'Wrong password.'
          : err.message || 'Failed to delete account.',
    });
  }

  await clearAuthToken();
  await clearPendingVerification();
  await clearPendingPasswordReset();
  redirect('/login');
}
