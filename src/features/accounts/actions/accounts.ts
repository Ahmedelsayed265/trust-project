'use server';

import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import { requireAuth } from '@/features/auth/session';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  AccountsListData,
  ConnectedAccount,
  SyncAccountsData,
} from '@/features/accounts/types';

export async function getAccountsAction(): Promise<
  ActionResult<AccountsListData>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<AccountsListData>>(
      '/user/accounts',
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load accounts.');
  }
}

export async function getAccountAction(
  providerId: string,
): Promise<ActionResult<ConnectedAccount>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<ConnectedAccount>>(
      `/user/accounts/${providerId}`,
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load connection detail.');
  }
}

export async function connectAccountAction(input: {
  provider_id: string;
  api_key: string;
  api_secret: string;
  environment?: string;
}): Promise<ActionResult<ConnectedAccount>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<ConnectedAccount>>(
      '/user/accounts/connect',
      {
        provider_id: input.provider_id,
        api_key: input.api_key,
        api_secret: input.api_secret,
        environment: input.environment,
      },
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Could not connect provider.');
  }
}

export async function syncAccountsAction(input?: {
  provider_id?: string;
}): Promise<ActionResult<SyncAccountsData>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<SyncAccountsData>>(
      '/user/accounts/sync',
      input?.provider_id ? { provider_id: input.provider_id } : {},
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to sync accounts.');
  }
}

export async function disconnectAccountAction(
  providerId: string,
): Promise<ActionResult<ConnectedAccount>> {
  try {
    const token = await requireAuth();
    const response = await api.delete<ApiSuccessResponse<ConnectedAccount>>(
      `/user/accounts/${providerId}`,
      undefined,
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to disconnect provider.');
  }
}

export async function setDefaultAccountAction(
  providerId: string,
): Promise<ActionResult<ConnectedAccount[]>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<ConnectedAccount[]>>(
      `/user/accounts/${providerId}/default`,
      undefined,
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to set default account.');
  }
}
