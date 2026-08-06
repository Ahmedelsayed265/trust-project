'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
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
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || 'Failed to load FAQs.',
        errors: error.errors,
        status: error.status,
      };
    }

    return {
      ok: false,
      message: error instanceof Error ? error.message : 'Failed to load FAQs.',
    };
  }
}
