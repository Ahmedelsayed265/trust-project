'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type {
  TwoFactorConfirmData,
  TwoFactorEnableData,
} from '@/features/security/types';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function enableTwoFactorAction(): Promise<
  ActionResult<TwoFactorEnableData>
> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<TwoFactorEnableData>>(
      '/user/security/two-factor/enable',
      undefined,
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to start two-factor setup.');
  }
}

export async function confirmTwoFactorAction(input: {
  code: string;
}): Promise<ActionResult<TwoFactorConfirmData>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<TwoFactorConfirmData>>(
      '/user/security/two-factor/confirm',
      { code: input.code.trim() },
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to confirm two-factor setup.');
  }
}

export async function disableTwoFactorAction(input: {
  code: string;
}): Promise<ActionResult<null>> {
  try {
    const token = await requireAuth();
    await api.post<ApiSuccessResponse<null>>(
      '/user/security/two-factor/disable',
      { code: input.code.trim() },
      { token },
    );
    return { ok: true, data: null };
  } catch (error) {
    return mapActionError(
      error,
      'Failed to disable two-factor authentication.',
    );
  }
}
