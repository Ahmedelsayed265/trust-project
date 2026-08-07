'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import type { HomeData } from '@/features/dashboard/types';
import { requireAuth } from '@/features/auth/session';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getHomeAction(): Promise<ActionResult<HomeData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<HomeData>>('/user/home', {
      token,
    });
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load home dashboard.');
  }
}
