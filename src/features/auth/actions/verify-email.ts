"use server";

import { api, ApiError, type ActionResult } from "@/shared/lib/api";
import { setAuthToken } from "@/features/auth/session";
import {
  clearPendingVerification,
  getPendingVerification,
} from "@/features/auth/pending-session";
import type { ApiSuccessResponse, AuthUser } from "@/features/auth/types";

export type VerifyEmailResult = ActionResult<{ next: "/" }>;

export async function verifyEmailAction(input: {
  code: string;
}): Promise<VerifyEmailResult> {
  const code = input.code.trim();
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, message: "Enter the 6-digit code." };
  }

  const signup = await getPendingVerification();
  if (!signup) {
    return { ok: false, message: "No pending verification. Sign in again." };
  }

  try {
    await api.post<ApiSuccessResponse<AuthUser | null>>(
      "/user/auth/verify-email",
      { code },
      { token: signup.token }
    );

    await clearPendingVerification();
    await setAuthToken(signup.token, signup.remember);

    return { ok: true, data: { next: "/" } };
  } catch (error) {
    if (error instanceof ApiError) {
      return {
        ok: false,
        message: error.message || "Invalid verification code.",
        errors: error.errors,
        status: error.status,
      };
    }

    return {
      ok: false,
      message:
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
    };
  }
}

export async function cancelEmailVerificationAction() {
  await clearPendingVerification();
}
