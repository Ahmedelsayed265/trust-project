import { cookies } from 'next/headers';
import { redirect } from '@/i18n/redirect';

const PENDING_TOKEN_COOKIE = 'trustai_pending_token';
const PENDING_EMAIL_COOKIE = 'trustai_pending_email';
const PENDING_REMEMBER_COOKIE = 'trustai_pending_remember';
const PENDING_RESET_EMAIL_COOKIE = 'trustai_pending_reset_email';
const PENDING_RESET_CODE_COOKIE = 'trustai_pending_reset_code';

const PENDING_MAX_AGE = 60 * 30;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge,
  };
}

export async function setPendingVerification(input: {
  email: string;
  token: string;
  remember?: boolean;
}) {
  const jar = await cookies();
  const options = cookieOptions(PENDING_MAX_AGE);
  jar.set(PENDING_TOKEN_COOKIE, input.token, options);
  jar.set(PENDING_EMAIL_COOKIE, input.email, options);
  jar.set(
    PENDING_REMEMBER_COOKIE,
    input.remember === false ? '0' : '1',
    options,
  );
  jar.delete(PENDING_RESET_EMAIL_COOKIE);
  jar.delete(PENDING_RESET_CODE_COOKIE);
}

export async function getPendingVerification() {
  const jar = await cookies();
  const token = jar.get(PENDING_TOKEN_COOKIE)?.value ?? null;
  const email = jar.get(PENDING_EMAIL_COOKIE)?.value ?? null;
  if (!token || !email) return null;

  return {
    token,
    email,
    remember: jar.get(PENDING_REMEMBER_COOKIE)?.value !== '0',
  };
}

export async function clearPendingVerification() {
  const jar = await cookies();
  jar.delete(PENDING_TOKEN_COOKIE);
  jar.delete(PENDING_EMAIL_COOKIE);
  jar.delete(PENDING_REMEMBER_COOKIE);
}

export async function setPendingPasswordReset(input: {
  email: string;
  code?: string;
}) {
  const jar = await cookies();
  const options = cookieOptions(PENDING_MAX_AGE);
  jar.set(PENDING_RESET_EMAIL_COOKIE, input.email, options);

  if (input.code) {
    jar.set(PENDING_RESET_CODE_COOKIE, input.code, options);
  } else {
    jar.delete(PENDING_RESET_CODE_COOKIE);
  }

  jar.delete(PENDING_TOKEN_COOKIE);
  jar.delete(PENDING_EMAIL_COOKIE);
  jar.delete(PENDING_REMEMBER_COOKIE);
}

export async function getPendingPasswordReset() {
  const jar = await cookies();
  const email = jar.get(PENDING_RESET_EMAIL_COOKIE)?.value ?? null;
  if (!email) return null;

  return {
    email,
    code: jar.get(PENDING_RESET_CODE_COOKIE)?.value ?? null,
  };
}

export async function clearPendingPasswordReset() {
  const jar = await cookies();
  jar.delete(PENDING_RESET_EMAIL_COOKIE);
  jar.delete(PENDING_RESET_CODE_COOKIE);
}

export type PendingOtp =
  | {
      purpose: 'signup';
      email: string;
      token: string;
      remember: boolean;
    }
  | {
      purpose: 'reset';
      email: string;
    };

export async function requirePendingOtp(): Promise<PendingOtp> {
  const signup = await getPendingVerification();

  if (signup) {
    return { purpose: 'signup', ...signup };
  }

  const reset = await getPendingPasswordReset();

  if (reset?.email) {
    return { purpose: 'reset', email: reset.email };
  }

  return await redirect('/login');
}

export async function requireVerifiedPasswordReset() {
  const pending = await getPendingPasswordReset();
  if (!pending?.email) {
    return await redirect('/forgot-password');
  }
  if (!pending.code) {
    return await redirect('/verify-email');
  }
  return { email: pending.email, code: pending.code };
}
