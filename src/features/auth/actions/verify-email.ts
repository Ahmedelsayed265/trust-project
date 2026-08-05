"use server";

import { api, ApiError, type ActionResult } from "@/shared/lib/api";
import {
  clearPendingVerification,
  getPendingVerification,
  setAuthToken,
} from "@/features/auth/session";
import type { ApiSuccessResponse, AuthUser } from "@/features/auth/types";

export async function verifyEmailAction(input: {
  code: string;
}): Promise<ActionResult<AuthUser | null>> {
  const code = input.code.trim();
  const pending = await getPendingVerification();

  if (!pending) {
    return { ok: false, message: "No pending verification. Sign in again." };
  }
  if (!/^\d{6}$/.test(code)) {
    return { ok: false, message: "Enter the 6-digit code." };
  }

  try {
    const response = await api.post<ApiSuccessResponse<AuthUser | null>>(
      "/user/auth/verify-email",
      { code },
      { token: pending.token }
    );

    await clearPendingVerification();
    await setAuthToken(pending.token, pending.remember);

    return { ok: true, data: response.data ?? null };
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
