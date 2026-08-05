"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { SubmitButton } from "@/shared/components/submit-button";
import { sendVerificationCodeAction } from "@/features/auth/actions/send-verification-code";
import {
  cancelEmailVerificationAction,
  verifyEmailAction,
} from "@/features/auth/actions/verify-email";

const RESEND_SECONDS = 3 * 60;

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function VerifyEmailForm({ email }: { email: string }) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [pending, startTransition] = useTransition();
  const [resending, startResend] = useTransition();

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  function onVerify(nextCode = code) {
    if (nextCode.length !== 6) {
      toast.error("Enter the 6-digit code.");
      return;
    }

    startTransition(async () => {
      const result = await verifyEmailAction({ code: nextCode });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success("Email verified.");
      router.push("/");
      router.refresh();
    });
  }

  function onResend() {
    if (secondsLeft > 0 || resending) return;

    startResend(async () => {
      const result = await sendVerificationCodeAction();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setCode("");
      setSecondsLeft(RESEND_SECONDS);
      toast.success("A new code was sent to your email.");
    });
  }

  function onBack() {
    startTransition(async () => {
      await cancelEmailVerificationAction();
      router.push("/login");
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        disabled={pending}
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-60"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Verify your email
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter the code we sent to finish signing in
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onVerify();
        }}
      >
        <p className="text-sm leading-relaxed text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>. Enter it
          below to verify your email.
        </p>

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={code}
            onChange={setCode}
            onComplete={onVerify}
            disabled={pending}
            containerClassName="gap-2"
          >
            <InputOTPGroup className="gap-2.5 bg-transparent">
              {Array.from({ length: 6 }).map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-12 rounded-[12px]! border border-neutral-300 bg-card text-base font-semibold shadow-none first:rounded-[12px]! first:border-l last:rounded-[12px]! data-[active=true]:border-primary data-[active=true]:ring-3 data-[active=true]:ring-primary/20 dark:border-neutral-600"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        <SubmitButton
          loading={pending}
          loadingText="Verifying..."
          disabled={code.length !== 6}
        >
          Verify email
        </SubmitButton>

        <p className="text-center text-sm text-muted-foreground">
          {secondsLeft > 0 ? (
            <>Resend code in {formatTimer(secondsLeft)}</>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="font-medium text-primary hover:underline disabled:opacity-60"
            >
              {resending ? "Sending..." : "Resend code"}
            </button>
          )}
        </p>
      </form>
    </>
  );
}
