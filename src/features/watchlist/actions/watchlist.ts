'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  AddWatchlistInput,
  WatchlistData,
  WatchlistItem,
  WatchlistToggleData,
} from '@/features/watchlist/types';
import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import { requireAuth } from '@/features/auth/session';

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

function normalizeSymbol(symbol: string) {
  return symbol.trim().replace(/\//g, '').toUpperCase();
}

export async function getWatchlistAction(): Promise<
  ActionResult<WatchlistData>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<WatchlistData>>(
      '/user/watchlist',
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load watchlist.');
  }
}

export async function addToWatchlistAction(
  input: AddWatchlistInput,
): Promise<ActionResult<WatchlistItem>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<WatchlistItem>>(
      '/user/watchlist',
      {
        symbol: normalizeSymbol(input.symbol),
        alert_above: input.alert_above ?? undefined,
        alert_below: input.alert_below ?? undefined,
      },
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Could not add to watchlist.');
  }
}

export async function toggleWatchlistAction(
  symbol: string,
): Promise<ActionResult<WatchlistToggleData>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<WatchlistToggleData>>(
      '/user/watchlist/toggle',
      { symbol: normalizeSymbol(symbol) },
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Could not update watchlist.');
  }
}

export async function removeFromWatchlistAction(
  identifier: string | number,
): Promise<ActionResult<WatchlistItem | null>> {
  try {
    const token = await requireAuth();
    const pathId =
      typeof identifier === 'number'
        ? String(identifier)
        : normalizeSymbol(identifier);

    const response = await api.delete<ApiSuccessResponse<WatchlistItem | null>>(
      `/user/watchlist/${pathId}`,
      undefined,
      { token },
    );

    return { ok: true, data: response.data ?? null };
  } catch (error) {
    return mapError(error, 'Could not remove from watchlist.');
  }
}

export async function reorderWatchlistAction(
  ids: number[],
): Promise<ActionResult<WatchlistData>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<WatchlistData>>(
      '/user/watchlist/reorder',
      { ids },
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Could not reorder watchlist.');
  }
}
