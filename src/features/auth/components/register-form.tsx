"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { FormTextField } from "@/shared/components/form-text-field";
import { FormPasswordField } from "@/shared/components/form-password-field";
import { SubmitButton } from "@/shared/components/submit-button";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import { registerAction } from "@/features/auth/actions/register";
import {
  Field,
  FieldContent,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth";

const authInputClassName = "h-12 rounded-[12px]! bg-card px-3";

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      terms: false,
    },
  });

  function onSubmit(values: RegisterFormValues) {
    startTransition(async () => {
      const result = await registerAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof RegisterFormValues, {
              type: "server",
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      router.push("/");
      router.refresh();
    });
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormTextField
          control={form.control}
          name="first_name"
          label="First name"
          autoComplete="given-name"
          placeholder="John"
          inputClassName={authInputClassName}
        />

        <FormTextField
          control={form.control}
          name="last_name"
          label="Last name"
          autoComplete="family-name"
          placeholder="Doe"
          inputClassName={authInputClassName}
        />
      </div>

      <FormTextField
        control={form.control}
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        inputClassName={authInputClassName}
      />

      <FormPasswordField
        control={form.control}
        name="password"
        label="Password"
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

      <Controller
        control={form.control}
        name="terms"
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid || undefined}>
            <FieldContent>
              <label className="flex items-start gap-2.5 text-sm text-muted-foreground">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                  className="mt-0.5 cursor-pointer"
                />
                <span>
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </FieldContent>
          </Field>
        )}
      />

      <SubmitButton
        loading={pending || form.formState.isSubmitting}
        loadingText="Creating account..."
      >
        Create account
      </SubmitButton>

      <div className="space-y-4 pt-1">
        <FieldSeparator className="my-0 h-auto py-1">
          Or continue with
        </FieldSeparator>
        <OAuthButtons />
      </div>
    </form>
  );
}
