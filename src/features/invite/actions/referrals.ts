'use server';

import type { ApiSuccessResponse } from '@/features/auth/types';
import type {
  InviteByEmailInput,
  ReferralInvite,
  ReferralsData,
} from '@/features/invite/types';
import { requireAuth } from '@/features/auth/session';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';

export async function getReferralsAction(): Promise<
  ActionResult<ReferralsData>
> {
  try {
    const token = await requireAuth();
    const response = await api.get<ApiSuccessResponse<ReferralsData>>(
      '/user/referrals',
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to load referrals.');
  }
}

export async function inviteByEmailAction(
  input: InviteByEmailInput,
): Promise<ActionResult<ReferralInvite>> {
  try {
    const token = await requireAuth();
    const response = await api.post<ApiSuccessResponse<ReferralInvite>>(
      '/user/referrals/invite',
      {
        email: input.email.trim(),
        ...(input.name?.trim() ? { name: input.name.trim() } : {}),
      },
      { token },
    );
    return { ok: true, data: response.data };
  } catch (error) {
    return mapActionError(error, 'Failed to send invitation.');
  }
}
