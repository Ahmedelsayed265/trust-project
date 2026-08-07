'use server';

import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import { requireAuth } from '@/features/auth/session';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  GetSignalsInput,
  SignalsListData,
  SignalsStats,
} from '@/features/ai-signals/types';

function clampPerPage(value?: number) {
  if (value == null) return 20;
  return Math.min(100, Math.max(1, value));
}

export async function getSignalsAction(
  input: GetSignalsInput = {},
): Promise<ActionResult<SignalsListData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<SignalsListData>>(
      '/signals',
      {
        token,
        query: {
          status: input.status || undefined,
          side: input.side || undefined,
          strength: input.strength || undefined,
          symbol: input.symbol?.trim() || undefined,
          asset_class: input.asset_class?.trim() || undefined,
          page: input.page,
          per_page: clampPerPage(input.per_page),
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load signals.');
  }
}

export async function getSignalsStatsAction(): Promise<
  ActionResult<SignalsStats>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<SignalsStats>>(
      '/signals/stats',
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load signal stats.');
  }
}
