'use server';

import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  GetHelpInput,
  HelpArticle,
  HelpListData,
} from '@/features/help/types';

export async function getHelpAction(
  input: GetHelpInput = {},
): Promise<ActionResult<HelpListData>> {
  try {
    const response = await api.get<ApiSuccessResponse<HelpListData>>('/help', {
      query: {
        category: input.category || undefined,
        search: input.search?.trim() || undefined,
      },
    });

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load help articles.');
  }
}

export async function getHelpBySlugAction(
  slug: string,
): Promise<ActionResult<HelpArticle>> {
  try {
    const response = await api.get<ApiSuccessResponse<HelpArticle>>(
      `/help/${slug}`,
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load help article.');
  }
}
