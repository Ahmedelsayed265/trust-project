'use server';

import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  GetNewsInput,
  NewsArticle,
  NewsListData,
} from '@/features/news/types';

function clampPerPage(value?: number) {
  if (value == null) return 15;
  return Math.min(100, Math.max(1, value));
}

export async function getNewsAction(
  input: GetNewsInput = {},
): Promise<ActionResult<NewsListData>> {
  try {
    const response = await api.get<ApiSuccessResponse<NewsListData>>('/news', {
      query: {
        tag: input.tag || undefined,
        symbol: input.symbol?.trim() || undefined,
        search: input.search?.trim() || undefined,
        page: input.page,
        per_page: clampPerPage(input.per_page),
      },
    });

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load news.');
  }
}

export async function getNewsBySlugAction(
  slug: string,
): Promise<ActionResult<NewsArticle>> {
  try {
    const response = await api.get<ApiSuccessResponse<NewsArticle>>(
      `/news/${slug}`,
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load article.');
  }
}
