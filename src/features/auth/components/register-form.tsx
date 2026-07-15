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
} from "@/components/ui/field";
import { FormTextField } from "@/shared/components/form-text-field";
import { FormPasswordField } from "@/shared/components/form-password-field";
import {
  registerSchema,
  type RegisterFormValues,
} from "@/features/auth/schemas/auth";
import { routes } from "@/shared/lib/routes";

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
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <FormTextField
          control={form.control}
          name="firstName"
          label="First name"
          autoComplete="given-name"
          placeholder="John"
        />
        <FormTextField
          control={form.control}
          name="lastName"
          label="Last name"
          autoComplete="family-name"
          placeholder="Doe"
        />
      </div>

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
        autoComplete="new-password"
        placeholder="Min. 8 characters"
      />

      <FormPasswordField
        control={form.control}
        name="confirmPassword"
        label="Confirm password"
        autoComplete="new-password"
        placeholder="Repeat your password"
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
        className="mt-2 h-12 w-full rounded-md py-3"
        disabled={form.formState.isSubmitting}
      >
        {form.formState.isSubmitting ? "Creating account..." : "Create account"}
      </Button>
    </form>
  );
}
