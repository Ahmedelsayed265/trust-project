'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import {
  getPendingVerification,
  setPendingVerification,
} from '@/features/auth/pending-session';
import type { ApiSuccessResponse } from '@/features/auth/types';

export async function startEmailVerificationAction(input: {
  email: string;
  token: string;
  remember?: boolean;
}): Promise<ActionResult<null>> {
  if (!input.token || !input.email) {
    return { ok: false, message: 'Missing verification details.' };
  }

  try {
    await api.post<ApiSuccessResponse<unknown>>(
      '/user/auth/send-verification-code',
      undefined,
      { token: input.token },
    );

    await setPendingVerification({
      email: input.email,
      token: input.token,
      remember: input.remember,
    });

    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Failed to send verification code.',
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
}

export async function sendVerificationCodeAction(): Promise<
  ActionResult<null>
> {
  const pending = await getPendingVerification();
  if (!pending) {
    return { ok: false, message: 'No pending verification. Sign in again.' };
  }

  try {
    const response = await api.post<ApiSuccessResponse<unknown>>(
      '/user/auth/send-verification-code',
      undefined,
      { token: pending.token },
    );

    console.log('[send-verification-code]', response);

    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Failed to send verification code.',
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
}
