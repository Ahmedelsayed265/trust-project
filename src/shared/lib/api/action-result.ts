import { ApiError, type ActionResult } from '@/shared/lib/api/types';

type MapActionErrorOptions = {
  /** Override the message for ApiError responses. */
  message?: (error: ApiError) => string;
};

export function mapActionError(
  error: unknown,
  fallback: string,
  options?: MapActionErrorOptions,
): ActionResult<never> {
  if (error instanceof ApiError) {
    return {
      ok: false,
      message: options?.message?.(error) ?? (error.message || fallback),
      errors: error.errors,
      status: error.status,
    };
  }

  return {
    ok: false,
    message: error instanceof Error ? error.message : fallback,
  };
}
