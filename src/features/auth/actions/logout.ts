'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { redirect } from '@/i18n/redirect';
import { api } from '@/shared/lib/api';
import { clearAuthToken, getAuthToken } from '@/features/auth/session';

export type LogoutApiResponse = ApiSuccessResponse<null>;

export async function logoutAction() {
  const token = await getAuthToken();

  try {
    if (token) {
      await api.post<LogoutApiResponse>('/user/auth/logout', undefined, {
        token,
      });
    }
  } catch {
    throw new Error('Failed to logout');
  }

  await clearAuthToken();
  return await redirect('/login');
}
