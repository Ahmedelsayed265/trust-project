'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type { SecurityOverview } from '@/features/security/types';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getSecurityAction(): Promise<
  ActionResult<SecurityOverview>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<SecurityOverview>>(
      '/user/security',
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load security settings.');
  }
}
