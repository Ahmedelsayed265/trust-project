'use client';

import { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { SubmitButton } from '@/shared/components/submit-button';
import { sendVerificationCodeAction } from '@/features/auth/actions/send-verification-code';
import {
  cancelEmailVerificationAction,
  verifyEmailAction,
} from '@/features/auth/actions/verify-email';
import {
  cancelPasswordResetAction,
  resendPasswordResetCodeAction,
  verifyResetCodeAction,
} from '@/features/auth/actions/forgot-password';

const RESEND_SECONDS = 3 * 60;

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function VerifyEmailForm({
  email,
  purpose,
}: {
  email: string;
  purpose: 'signup' | 'reset';
}) {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [pending, startTransition] = useTransition();
  const [resending, startResend] = useTransition();

  const isReset = purpose === 'reset';

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = window.setTimeout(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);
    return () => window.clearTimeout(id);
  }, [secondsLeft]);

  function onVerify(nextCode = code) {
    if (nextCode.length !== 6) {
      toast.error('Enter the 6-digit code.');
      return;
    }

    startTransition(async () => {
      const result = isReset
        ? await verifyResetCodeAction({ code: nextCode })
        : await verifyEmailAction({ code: nextCode });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        isReset ? 'Code verified. Set your new password.' : 'Email verified.',
      );
      router.push(result.data.next);
      router.refresh();
    });
  }

  function onResend() {
    if (secondsLeft > 0 || resending) return;

    startResend(async () => {
      const result = isReset
        ? await resendPasswordResetCodeAction()
        : await sendVerificationCodeAction();

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setCode('');
      setSecondsLeft(RESEND_SECONDS);
      toast.success('A new code was sent to your email.');
    });
  }

  function onBack() {
    startTransition(async () => {
      if (isReset) {
        await cancelPasswordResetAction();
        router.push('/forgot-password');
      } else {
        await cancelEmailVerificationAction();
        router.push('/login');
      }
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        disabled={pending}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm font-medium disabled:opacity-60"
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      <div className="mb-8 space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          {isReset ? 'Enter reset code' : 'Verify your email'}
        </h2>
        <p className="text-muted-foreground text-sm">
          {isReset
            ? 'Enter the 6-digit code we sent to reset your password'
            : 'Enter the code we sent to finish signing in'}
        </p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          onVerify();
        }}
      >
        <p className="text-muted-foreground text-sm leading-relaxed">
          We sent a 6-digit code to{' '}
          <span className="text-foreground font-medium">{email}</span>. Enter it
          below to continue.
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
                  className="bg-card data-[active=true]:border-primary data-[active=true]:ring-primary/20 size-12 rounded-[12px]! border border-neutral-300 text-base font-semibold shadow-none first:rounded-[12px]! first:border-l last:rounded-[12px]! data-[active=true]:ring-3 dark:border-neutral-600"
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
          Continue
        </SubmitButton>

        <p className="text-muted-foreground text-center text-sm">
          {secondsLeft > 0 ? (
            <>Resend code in {formatTimer(secondsLeft)}</>
          ) : (
            <button
              type="button"
              onClick={onResend}
              disabled={resending}
              className="text-primary font-medium hover:underline disabled:opacity-60"
            >
              {resending ? 'Sending...' : 'Resend code'}
            </button>
          )}
        </p>
      </form>
    </>
  );
}
