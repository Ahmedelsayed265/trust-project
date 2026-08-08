'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type {
  GetPortfolioInput,
  PortfolioAllocationSlice,
  PortfolioBalancesData,
  PortfolioData,
  PortfolioHistoryData,
  PortfolioHistoryRange,
  PortfolioPosition,
} from '@/features/portfolio/types';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getPortfolioAction(
  input: GetPortfolioInput = {},
): Promise<ActionResult<PortfolioData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<PortfolioData>>(
      '/user/portfolio',
      {
        token,
        query: {
          provider_id: input.provider_id?.trim() || undefined,
          fresh: input.fresh ? 1 : undefined,
        },
      },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load portfolio.');
  }
}

export async function getPortfolioAllocationAction(): Promise<
  ActionResult<PortfolioAllocationSlice[]>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<
      ApiSuccessResponse<PortfolioAllocationSlice[]>
    >('/user/portfolio/allocation', { token });
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load allocation.');
  }
}

export async function getPortfolioHistoryAction(
  range: PortfolioHistoryRange = '1m',
): Promise<ActionResult<PortfolioHistoryData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<PortfolioHistoryData>>(
      '/user/portfolio/history',
      { token, query: { range } },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load equity history.');
  }
}

export async function getPortfolioPositionsAction(
  providerId?: string,
): Promise<ActionResult<PortfolioPosition[]>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<PortfolioPosition[]>>(
      '/user/portfolio/positions',
      { token, query: { provider_id: providerId?.trim() || undefined } },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load positions.');
  }
}

export async function getPortfolioBalancesAction(
  providerId?: string,
): Promise<ActionResult<PortfolioBalancesData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<PortfolioBalancesData>>(
      '/user/portfolio/balances',
      { token, query: { provider_id: providerId?.trim() || undefined } },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load balances.');
  }
}
