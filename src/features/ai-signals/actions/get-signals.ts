'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import { requireAuth } from '@/features/auth/session';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  GetSignalsInput,
  SignalsListData,
  SignalsStats,
} from '@/features/ai-signals/types';

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
    return mapError(error, 'Failed to load signals.');
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
    return mapError(error, 'Failed to load signal stats.');
  }
}
