import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_TOKEN_COOKIE = "trustai_token";
const PENDING_TOKEN_COOKIE = "trustai_pending_token";
const PENDING_EMAIL_COOKIE = "trustai_pending_email";
const PENDING_REMEMBER_COOKIE = "trustai_pending_remember";

const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_MAX_AGE = 60 * 60 * 24;
const PENDING_MAX_AGE = 60 * 30;

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export async function setAuthToken(token: string, remember = true) {
  const jar = await cookies();
  jar.set(
    AUTH_TOKEN_COOKIE,
    token,
    cookieOptions(remember ? REMEMBER_MAX_AGE : SESSION_MAX_AGE)
  );
}

export async function getAuthToken() {
  const jar = await cookies();
  return jar.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function clearAuthToken() {
  const jar = await cookies();
  jar.delete(AUTH_TOKEN_COOKIE);
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
    input.remember === false ? "0" : "1",
    options
  );
}

export async function getPendingVerification() {
  const jar = await cookies();
  const token = jar.get(PENDING_TOKEN_COOKIE)?.value ?? null;
  const email = jar.get(PENDING_EMAIL_COOKIE)?.value ?? null;
  if (!token || !email) return null;

  return {
    token,
    email,
    remember: jar.get(PENDING_REMEMBER_COOKIE)?.value !== "0",
  };
}

export async function clearPendingVerification() {
  const jar = await cookies();
  jar.delete(PENDING_TOKEN_COOKIE);
  jar.delete(PENDING_EMAIL_COOKIE);
  jar.delete(PENDING_REMEMBER_COOKIE);
}

export async function requireAuth() {
  const token = await getAuthToken();
  if (!token) redirect("/login");
  return token;
}

export async function requirePendingVerification() {
  const pending = await getPendingVerification();
  if (!pending) redirect("/login");
  return pending;
}
