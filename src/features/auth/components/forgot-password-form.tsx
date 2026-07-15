"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormTextField } from "@/shared/components/form-text-field";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/features/auth/schemas/auth";

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    void values;
    setSent(true);
  }

  if (sent) {
    return (
      <div className="space-y-4 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-emerald-50 text-success dark:bg-emerald-950/40">
          <MailCheck className="size-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Check your email
          </h2>
          <p className="text-sm text-muted-foreground">
            We sent a reset link to{" "}
            <span className="font-medium text-foreground">
              {form.getValues("email")}
            </span>
            .
          </p>
        </div>
        <Button
          type="button"
          variant="link"
          onClick={() => {
            setSent(false);
            form.reset();
          }}
        >
          Didn&apos;t get it? Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 space-y-2">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Reset password
        </h2>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormTextField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
        />
        <Button
          type="submit"
          className="mt-2 h-12 w-full rounded-md py-3"
          disabled={form.formState.isSubmitting}
        >
          {form.formState.isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
      </form>
    </>
  );
}
