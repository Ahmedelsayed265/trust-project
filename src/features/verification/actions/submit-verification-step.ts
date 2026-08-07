'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type {
  UserVerification,
  VerificationStepKey,
} from '@/features/verification/types';
import { isVerificationStepKey } from '@/features/verification/types';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function submitVerificationStepAction(
  step: VerificationStepKey,
  formData: FormData,
): Promise<ActionResult<UserVerification>> {
  if (!isVerificationStepKey(step)) {
    return { ok: false, message: 'Invalid verification step.' };
  }

  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<UserVerification>>(
      `/user/verification/${step}`,
      formData,
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to submit verification step.');
  }
}
