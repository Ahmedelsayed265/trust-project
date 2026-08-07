'use server';

import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import { setAuthToken } from '@/features/auth/session';
import {
  clearPendingVerification,
  getPendingVerification,
} from '@/features/auth/pending-session';
import type { ApiSuccessResponse, AuthUser } from '@/features/auth/types';

export type VerifyEmailResult = ActionResult<{ next: '/' }>;

export async function verifyEmailAction(input: {
  code: string;
}): Promise<VerifyEmailResult> {
  const code = input.code.trim();
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, message: 'Enter the 6-digit code.' };
  }

  const signup = await getPendingVerification();
  if (!signup) {
    return { ok: false, message: 'No pending verification. Sign in again.' };
  }

  try {
    await api.post<ApiSuccessResponse<AuthUser | null>>(
      '/user/auth/verify-email',
      { code },
      { token: signup.token },
    );

    await clearPendingVerification();
    await setAuthToken(signup.token, signup.remember);

    return { ok: true, data: { next: '/' } };
  } catch (error) {
    return mapActionError(error, 'Invalid verification code.');
  }
}

export async function cancelEmailVerificationAction() {
  await clearPendingVerification();
}
