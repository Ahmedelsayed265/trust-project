'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  CalendarEvent,
  CalendarMonthData,
  GetCalendarInput,
  GetCalendarUpcomingInput,
} from '@/features/calendar/types';

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

function clampLimit(value?: number) {
  if (value == null) return 5;
  return Math.min(50, Math.max(1, value));
}

export async function getCalendarAction(
  input: GetCalendarInput = {},
): Promise<ActionResult<CalendarMonthData>> {
  try {
    const response = await api.get<ApiSuccessResponse<CalendarMonthData>>(
      '/calendar',
      {
        query: {
          month: input.month || undefined,
          from: input.from || undefined,
          to: input.to || undefined,
          impact: input.impact || undefined,
          category: input.category || undefined,
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load calendar.');
  }
}

export async function getCalendarUpcomingAction(
  input: GetCalendarUpcomingInput = {},
): Promise<ActionResult<CalendarEvent[]>> {
  try {
    const response = await api.get<ApiSuccessResponse<CalendarEvent[]>>(
      '/calendar/upcoming',
      {
        query: {
          limit: clampLimit(input.limit),
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load upcoming events.');
  }
}
