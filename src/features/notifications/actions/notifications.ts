'use server';

import { api, ApiError, type ActionResult } from '@/shared/lib/api';
import { getCurrentUser } from '@/features/auth/get-current-user';
import { requireAuth } from '@/features/auth/session';
import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  Notification,
  NotificationType,
  NotificationsListData,
  UnreadCountData,
} from '@/features/notifications/types';

export type GetNotificationsInput = {
  page?: number;
  per_page?: number;
  type?: NotificationType;
  unread?: boolean;
};

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
  if (value == null) return 20;
  return Math.min(100, Math.max(1, value));
}

async function notificationHeaders() {
  try {
    const user = await getCurrentUser();
    return user.language ? { lang: user.language } : undefined;
  } catch {
    return undefined;
  }
}

export async function getNotificationsAction(
  input: GetNotificationsInput = {},
): Promise<ActionResult<NotificationsListData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<NotificationsListData>>(
      '/user/notifications',
      {
        token,
        headers: await notificationHeaders(),
        query: {
          page: input.page,
          per_page: clampPerPage(input.per_page),
          type: input.type,
          unread: input.unread ? 1 : undefined,
        },
      },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load notifications.');
  }
}

export async function getUnreadNotificationsCountAction(): Promise<
  ActionResult<UnreadCountData>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<UnreadCountData>>(
      '/user/notifications/unread-count',
      { token, headers: await notificationHeaders() },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load unread count.');
  }
}

export async function markNotificationReadAction(
  id: number,
): Promise<ActionResult<Notification>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<Notification>>(
      `/user/notifications/${id}/read`,
      undefined,
      { token, headers: await notificationHeaders() },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to mark notification as read.');
  }
}

export async function markAllNotificationsReadAction(): Promise<
  ActionResult<UnreadCountData>
> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<UnreadCountData>>(
      '/user/notifications/read-all',
      undefined,
      { token, headers: await notificationHeaders() },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to mark notifications as read.');
  }
}

export async function deleteNotificationAction(
  id: number,
): Promise<ActionResult<null>> {
  try {
    const token = await requireAuth();
    await api.delete<ApiSuccessResponse<null>>(
      `/user/notifications/${id}`,
      undefined,
      { token },
    );

    return { ok: true, data: null };
  } catch (error) {
    return mapError(error, 'Failed to delete notification.');
  }
}
