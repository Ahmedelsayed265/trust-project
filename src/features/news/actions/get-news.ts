'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  GetNewsInput,
  NewsArticle,
  NewsListData,
} from '@/features/news/types';

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
    return mapError(error, 'Failed to load news.');
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
    return mapError(error, 'Failed to load article.');
  }
}
