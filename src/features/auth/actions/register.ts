'use server';

import type { AuthUser, RegisterApiResponse } from '@/features/auth/types';
import type { RegisterFormValues } from '@/features/auth/schemas/auth';
import { api, ApiError, type ActionResult } from '@/shared/lib/api';

export async function registerAction(
  input: RegisterFormValues,
): Promise<ActionResult<AuthUser>> {
  try {
    const response = await api.post<RegisterApiResponse>(
      '/user/auth/register',
      { ...input, device_name: 'web' },
    );

    const user = response.data;
    if (!user?.token) {
      return {
        ok: false,
        message: 'Registration succeeded but no token was returned.',
      };
    }

    // Session cookie is set after email verification.
    return { ok: true, data: user };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Registration failed.',
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
