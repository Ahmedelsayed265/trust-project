'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import {
  clearPendingPasswordReset,
  getPendingPasswordReset,
  setPendingPasswordReset,
} from '@/features/auth/pending-session';
import type { ApiSuccessResponse } from '@/features/auth/types';

type ForgotPasswordData = {
  email: string;
  otp?: string;
};

type VerifyResetCodeData = {
  email: string;
  valid: boolean;
  expires_at?: string;
};

export async function forgotPasswordAction(input: {
  email: string;
}): Promise<ActionResult<ForgotPasswordData>> {
  try {
    const response = await api.post<ApiSuccessResponse<ForgotPasswordData>>(
      '/user/auth/forgot-password',
      { email: input.email },
    );

    console.log('[forgot-password]', response);

    const email = response.data?.email ?? input.email;
    await setPendingPasswordReset({ email });

    return { ok: true, data: { email, otp: response.data?.otp } };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Failed to send reset code.',
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

export async function resendPasswordResetCodeAction(): Promise<
  ActionResult<ForgotPasswordData>
> {
  const pending = await getPendingPasswordReset();
  if (!pending?.email) {
    return { ok: false, message: 'No pending reset. Start again.' };
  }

  return forgotPasswordAction({ email: pending.email });
}

export async function verifyResetCodeAction(input: {
  code: string;
}): Promise<ActionResult<{ next: '/reset-password' }>> {
  const code = input.code.trim();
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, message: 'Enter the 6-digit code.' };
  }

  const pending = await getPendingPasswordReset();
  if (!pending?.email) {
    return { ok: false, message: 'No pending reset. Start again.' };
  }

  try {
    const response = await api.post<ApiSuccessResponse<VerifyResetCodeData>>(
      '/user/auth/verify-reset-code',
      { email: pending.email, code },
    );

    console.log('[verify-reset-code]', response);

    if (response.data && response.data.valid === false) {
      return { ok: false, message: 'Invalid reset code.' };
    }

    await setPendingPasswordReset({ email: pending.email, code });

    return { ok: true, data: { next: '/reset-password' } };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Invalid reset code.',
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

export async function resetPasswordAction(input: {
  password: string;
  password_confirmation: string;
}): Promise<ActionResult<null>> {
  const pending = await getPendingPasswordReset();
  if (!pending?.email || !pending.code) {
    return { ok: false, message: 'Verify your reset code first.' };
  }

  try {
    await api.post<ApiSuccessResponse<null>>('/user/auth/reset-password', {
      email: pending.email,
      code: pending.code,
      password: input.password,
      password_confirmation: input.password_confirmation,
    });

    await clearPendingPasswordReset();

    return { ok: true, data: null };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Failed to reset password.',
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

export async function cancelPasswordResetAction() {
  await clearPendingPasswordReset();
}

/** Keep email pending, drop verified code, return to OTP step. */
export async function backToResetCodeAction() {
  const pending = await getPendingPasswordReset();
  if (pending?.email) {
    await setPendingPasswordReset({ email: pending.email });
  }
}
