"use client";

import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldError,
  FieldSeparator,
} from "@/components/ui/field";
import { FormTextField } from "@/shared/components/form-text-field";
import { FormPasswordField } from "@/shared/components/form-password-field";
import { OAuthButtons } from "@/features/auth/components/oauth-buttons";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth";
import { routes } from "@/shared/lib/routes";

const authInputClassName = "h-12 rounded-xl bg-card px-3";

export function RegisterForm() {
  const router = useRouter();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  function onSubmit(_values: RegisterFormValues) {
    router.push(routes.home);
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <FormTextField
          control={form.control}
          name="firstName"
          label="First name"
          autoComplete="given-name"
          placeholder="John"
          inputClassName={authInputClassName}
        />
        <FormTextField
          control={form.control}
          name="lastName"
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
        placeholder="Min. 8 characters"
        inputClassName={authInputClassName}
      />

      <FormPasswordField
        control={form.control}
        name="confirmPassword"
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
                  className="mt-0.5"
                />
                <span>
                  I agree to the{" "}
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    className="font-medium text-primary hover:underline"
                  >
                    Privacy Policy
                  </button>
                </span>
              </label>
              {fieldState.error && (
                <FieldError>{fieldState.error.message}</FieldError>
              )}
            </FieldContent>
          </Field>
        )}
      />

      <Button
        type="submit"
        className="h-12 w-full rounded-xl text-sm font-semibold"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
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
