import { cookies } from "next/headers";

const AUTH_TOKEN_COOKIE = "trustai_token";
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30;
const SESSION_MAX_AGE = 60 * 60 * 24;

export async function setAuthToken(token: string, remember = true) {
  const jar = await cookies();
  
  jar.set(AUTH_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: remember ? REMEMBER_MAX_AGE : SESSION_MAX_AGE,
  });
}

export async function getAuthToken() {
  const jar = await cookies();
  return jar.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function clearAuthToken() {
  const jar = await cookies();
  jar.delete(AUTH_TOKEN_COOKIE);
}
