'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function revokeOtherSessionsAction(): Promise<ActionResult<null>> {
  try {
    const token = await requireAuth();
    await api.delete<ApiSuccessResponse<null>>(
      '/user/security/sessions',
      undefined,
      { token },
    );
    return { ok: true, data: null };
  } catch (error) {
    return mapActionError(error, 'Failed to sign out other devices.');
  }
}

export async function revokeSessionAction(
  sessionId: number,
): Promise<ActionResult<null>> {
  try {
    const token = await requireAuth();
    await api.delete<ApiSuccessResponse<null>>(
      `/user/security/sessions/${sessionId}`,
      undefined,
      { token },
    );
    return { ok: true, data: null };
  } catch (error) {
    return mapActionError(error, 'Failed to revoke session.');
  }
}
