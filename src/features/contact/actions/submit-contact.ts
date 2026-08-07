'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { getAuthToken } from '@/features/auth/session';
import type { ContactFormValues } from '@/features/contact/schemas/contact';
import { api, ApiError, type ActionResult } from '@/shared/lib/api';

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

export async function submitContactAction(
  input: ContactFormValues,
): Promise<ActionResult<{ message: string }>> {
  try {
    const token = await getAuthToken();
    const response = await api.post<ApiSuccessResponse<null>>(
      '/contact-us',
      {
        name: input.name.trim(),
        email: input.email.trim(),
        category: input.category,
        subject: input.subject.trim(),
        message: input.message.trim(),
      },
      {
        token: token ?? undefined,
      },
    );

    return {
      ok: true,
      data: {
        message:
          response.message ||
          'Thanks — your message was received, we will reply shortly',
      },
    };
  } catch (error) {
    return mapError(error, 'Failed to send message.');
  }
}
