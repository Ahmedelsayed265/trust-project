'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import { getAuthToken } from '@/features/auth/session';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  GetMarketsInput,
  MarketCategory,
  MarketSymbolDetail,
  MarketTickerItem,
  MarketsListData,
  MarketsSummary,
} from '@/features/markets/types';

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
  return Math.min(50, Math.max(1, value));
}

export async function getMarketsAction(
  input: GetMarketsInput = {},
): Promise<ActionResult<MarketsListData>> {
  try {
    const token = await getAuthToken();
    const response = await api.get<ApiSuccessResponse<MarketsListData>>(
      '/markets',
      {
        token: token ?? undefined,
        query: {
          asset_class: input.asset_class || undefined,
          provider_id: input.provider_id || undefined,
          search: input.search?.trim() || undefined,
          sort: input.sort || undefined,
          direction: input.direction || undefined,
          page: input.page,
          per_page: clampPerPage(input.per_page),
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load markets.');
  }
}

export async function getMarketsCategoriesAction(): Promise<
  ActionResult<MarketCategory[]>
> {
  try {
    const response = await api.get<ApiSuccessResponse<MarketCategory[]>>(
      '/markets/categories',
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load market categories.');
  }
}

export async function getMarketsSummaryAction(): Promise<
  ActionResult<MarketsSummary>
> {
  try {
    const response =
      await api.get<ApiSuccessResponse<MarketsSummary>>('/markets/summary');

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load market summary.');
  }
}

export async function getMarketsTickerAction(): Promise<
  ActionResult<MarketTickerItem[]>
> {
  try {
    const response =
      await api.get<ApiSuccessResponse<MarketTickerItem[]>>('/markets/ticker');

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load market ticker.');
  }
}

export async function getMarketBySymbolAction(
  symbol: string,
  providerId?: string,
): Promise<ActionResult<MarketSymbolDetail>> {
  try {
    const token = await getAuthToken();
    const encoded = encodeURIComponent(symbol.trim());
    const response = await api.get<ApiSuccessResponse<MarketSymbolDetail>>(
      `/markets/${encoded}`,
      {
        token: token ?? undefined,
        query: {
          provider_id: providerId || undefined,
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load symbol.');
  }
}
