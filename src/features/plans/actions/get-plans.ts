'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import { requireAuth } from '@/features/auth/session';
import type {
  MySubscriptionData,
  Plan,
  PlansData,
  SubscribePlanInput,
  Subscription,
} from '@/features/plans/types';
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

export async function getPlansAction(): Promise<ActionResult<PlansData>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<PlansData>>(
      '/user/plans',
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load plans.');
  }
}

export async function getPlanByKeyAction(
  key: string,
): Promise<ActionResult<Plan>> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<Plan>>(
      `/user/plans/${encodeURIComponent(key.trim())}`,
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load plan.');
  }
}

export async function getMySubscriptionAction(): Promise<
  ActionResult<MySubscriptionData>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<MySubscriptionData>>(
      '/user/plans/my-subscription',
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to load subscription.');
  }
}

export async function subscribePlanAction(
  input: SubscribePlanInput,
): Promise<ActionResult<Subscription>> {
  try {
    const planKey = input.plan_key.trim();
    if (!planKey) {
      return { ok: false, message: 'Plan key is required.' };
    }

    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<Subscription>>(
      '/user/plans/subscribe',
      {
        plan_key: planKey,
        billing_cycle: input.billing_cycle,
        auto_renew: input.auto_renew ?? true,
      },
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to subscribe to plan.');
  }
}

export async function cancelSubscriptionAction(): Promise<
  ActionResult<Subscription>
> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<Subscription>>(
      '/user/plans/cancel',
      undefined,
      { token },
    );

    return { ok: true, data: response.data };
  } catch (error) {
    return mapError(error, 'Failed to cancel subscription.');
  }
}
