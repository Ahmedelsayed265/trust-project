"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { FormTextField } from "@/shared/components/form-text-field";
import { PageHeader } from "@/shared/components/page-header";
import { currentUser } from "@/shared/lib/user";
import {
  settingsSchema,
  type SettingsFormValues,
} from "@/features/settings/schemas/settings";
import { useState } from "react";

export function SettingsView() {
  const [saved, setSaved] = useState(false);
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      displayName: currentUser.name,
      email: currentUser.email,
      language: "en",
      currency: "USD",
      emailAlerts: true,
      pushAlerts: true,
      aiDigest: false,
    },
  });

  function onSubmit(_values: SettingsFormValues) {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Settings"
        description="Manage account defaults and notification preferences."
      />

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="grid max-w-3xl gap-4"
      >
        <Card className="">
          <CardHeader>
            <CardTitle>Account</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormTextField
              control={form.control}
              name="displayName"
              label="Display name"
              autoComplete="name"
            />
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="language"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="language">Language</FieldLabel>
                    <FieldContent>
                      <select
                        id="language"
                        {...field}
                        className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="en">English</option>
                        <option value="ar">Arabic</option>
                        <option value="es">Spanish</option>
                      </select>
                    </FieldContent>
                  </Field>
                )}
              />
              <Controller
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="currency">Display currency</FieldLabel>
                    <FieldContent>
                      <select
                        id="currency"
                        {...field}
                        className="h-11 w-full rounded-xl border border-input bg-card px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="SAR">SAR</option>
                      </select>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {(
              [
                ["emailAlerts", "Email alerts for fills and deposits"],
                ["pushAlerts", "Push alerts for AI signals"],
                ["aiDigest", "Daily AI market digest"],
              ] as const
            ).map(([name, label]) => (
              <Controller
                key={name}
                control={form.control}
                name={name}
                render={({ field }) => (
                  <label className="flex items-center gap-3 rounded-xl border border-border px-3 py-3 text-sm">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked === true)
                      }
                    />
                    <span className="text-foreground">{label}</span>
                  </label>
                )}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center gap-3">
          <Button type="submit" className="rounded-xl" disabled={form.formState.isSubmitting}>
            Save changes
          </Button>
          {saved && (
            <p className="text-sm font-medium text-success">Settings saved.</p>
          )}
        </div>
      </form>
    </div>
  );
}
