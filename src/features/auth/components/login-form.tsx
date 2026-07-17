"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FieldSeparator } from "@/components/ui/field";
import { FormTextField } from "@/shared/components/form-text-field";
import { FormPasswordField } from "@/shared/components/form-password-field";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/auth";
import { routes } from "@/shared/lib/routes";

export function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(_values: LoginFormValues) {
    router.push(routes.home);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <FormTextField
        control={form.control}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        inputClassName="h-12 rounded-xl bg-card px-3"
      />

      <FormPasswordField
        control={form.control}
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        inputClassName="h-12 rounded-xl bg-card px-3"
      />

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Controller
          control={form.control}
          name="remember"
          render={({ field }) => (
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox
                checked={field.value}
                onCheckedChange={(checked) => field.onChange(checked === true)}
              />
              Remember me
            </label>
          )}
        />
        <Link
          href={routes.forgotPassword}
          className="text-sm font-medium text-primary hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-sm font-semibold"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <div className="space-y-4 pt-1">
        <FieldSeparator className="my-0 h-auto py-1">
          Or continue with
        </FieldSeparator>
        <OAuthButtons />
      </div>
    </form>
  );
}
