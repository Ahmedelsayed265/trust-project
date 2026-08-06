"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { FormPasswordField } from "@/shared/components/form-password-field";
import { SubmitButton } from "@/shared/components/submit-button";
import {
  backToResetCodeAction,
  resetPasswordAction,
} from "@/features/auth/actions/forgot-password";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas/auth";

const authInputClassName = "h-12 rounded-[12px]! bg-card px-3";

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      password_confirmation: "",
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof ResetPasswordFormValues, {
              type: "server",
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      toast.success("Password updated. You can sign in now.");
      router.push("/login");
      router.refresh();
    });
  }

  function onBack() {
    startTransition(async () => {
      await backToResetCodeAction();
      router.push("/verify-email");
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
          Choose a new password
        </h2>
        <p className="text-sm text-muted-foreground">
          Create a new password for{" "}
          <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormPasswordField
          control={form.control}
          name="password"
          label="New password"
          autoComplete="new-password"
          placeholder="8+ chars, upper, lower, number, symbol"
          inputClassName={authInputClassName}
        />

        <FormPasswordField
          control={form.control}
          name="password_confirmation"
          label="Confirm password"
          autoComplete="new-password"
          placeholder="Repeat your password"
          inputClassName={authInputClassName}
        />

        <SubmitButton loading={pending} loadingText="Updating...">
          Reset password
        </SubmitButton>
      </form>
    </>
  );
}
