'use server';

import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type { FaqsData } from '@/features/faq/types';

export async function getFaqsAction(input?: {
  category?: string;
}): Promise<ActionResult<FaqsData>> {
  try {
    const response = await api.get<ApiSuccessResponse<FaqsData>>('/faqs', {
      query: {
        category: input?.category || undefined,
      },
    });

    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load FAQs.');
  }
}
