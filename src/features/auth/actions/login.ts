'use server';

import type { AuthUser, LoginApiResponse } from '@/features/auth/types';
import type { LoginFormValues } from '@/features/auth/schemas/auth';
import { api, mapActionError, type ActionResult } from '@/shared/lib/api';
import { setAuthToken } from '@/features/auth/session';

export async function loginAction(
  input: LoginFormValues,
): Promise<ActionResult<AuthUser>> {
  const { email, password, remember = false } = input;

  try {
    const response = await api.post<LoginApiResponse>('/user/auth/login', {
      email,
      password,
      remember,
      device_name: 'web',
    });

    const user = response.data;
    if (!user?.token) {
      return {
        ok: false,
        message: 'Login succeeded but no token was returned.',
      };
    }

    // Unverified users must complete OTP before getting a session cookie.
    if (!user.email_verified) {
      return { ok: true, data: user };
    }

    await setAuthToken(user.token, remember);

    return { ok: true, data: user };
  } catch (error) {
    return mapActionError(error, 'Invalid email or password.');
  }
}
