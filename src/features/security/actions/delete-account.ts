'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { redirect } from 'next/navigation';
import { api, ApiError, type ActionResult } from '@/shared/lib/api';
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
    if (error instanceof ApiError) {
      return {
        ok: false,
        message:
          error.status === 422
            ? error.message || 'Wrong password.'
            : error.message || 'Failed to delete account.',
        errors: error.errors,
        status: error.status,
      };
    }

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : 'Something went wrong. Please try again.',
    };
  }

  await clearAuthToken();
  await clearPendingVerification();
  await clearPendingPasswordReset();
  redirect('/login');
}
