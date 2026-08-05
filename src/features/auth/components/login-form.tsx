"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldSeparator } from "@/components/ui/field";
import { FormTextField } from "@/shared/components/form-text-field";
import { FormPasswordField } from "@/shared/components/form-password-field";
import { SubmitButton } from "@/shared/components/submit-button";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { loginAction } from "@/features/auth/actions/login";
import { startEmailVerificationAction } from "@/features/auth/actions/send-verification-code";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth";

export function LoginForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const result = await loginAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof LoginFormValues, {
              type: "server",
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      if (!result.data.email_verified) {
        const started = await startEmailVerificationAction({
          email: result.data.email,
          token: result.data.token,
          remember: values.remember,
        });

        if (!started.ok) {
          toast.error(started.message);
          return;
        }

        toast.message("Verify your email to continue.");
        router.push("/verify-email");
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Welcome back
        </h2>
        <p className="text-sm text-muted-foreground">
          Sign in to your TrustAI account
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          inputClassName="h-12 rounded-[12px]! bg-card px-3"
        />

        <FormPasswordField
          control={form.control}
          name="password"
          label="Password"
          autoComplete="current-password"
          placeholder="Enter your password"
          inputClassName="h-12 rounded-[12px]! bg-card px-3"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Controller
            control={form.control}
            name="remember"
            render={({ field }) => (
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                Remember me
              </label>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <SubmitButton
          loading={pending || form.formState.isSubmitting}
          loadingText="Signing in..."
        >
          Sign in
        </SubmitButton>

        <div className="space-y-4 pt-1">
          <FieldSeparator className="my-0 h-auto py-1">
            Or continue with
          </FieldSeparator>
          <OAuthButtons />
        </div>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-primary hover:underline"
        >
          Create account
        </Link>
      </p>
    </>
  );
}
