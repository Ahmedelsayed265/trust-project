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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormTextField
        control={form.control}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
      />

      <FormPasswordField
        control={form.control}
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
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
        className="mt-2 h-12 w-full rounded-md py-3"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Signing in..." : "Sign in"}
      </Button>

      <FieldSeparator>Or continue with</FieldSeparator>
      <OAuthButtons />
    </form>
  );
}
