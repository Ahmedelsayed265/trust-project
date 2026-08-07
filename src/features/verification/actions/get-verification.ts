'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type { UserVerification } from '@/features/verification/types';
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

export async function getVerificationAction(): Promise<
  ActionResult<UserVerification>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<UserVerification>>(
      '/user/verification',
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load verification status.');
  }
}
