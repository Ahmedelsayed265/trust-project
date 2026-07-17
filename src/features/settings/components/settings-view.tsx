"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Bell,
  Check,
  Globe2,
  Mail,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormTextField } from "@/shared/components/form-text-field";
import { PageHeader } from "@/shared/components/page-header";
import { currentUser } from "@/shared/lib/user";
import {
  settingsSchema,
  type SettingsFormValues,
} from "@/features/settings/schemas/settings";
import { cn } from "@/lib/utils";

const languages = [
  { value: "en", label: "English" },
  { value: "ar", label: "Arabic" },
  { value: "es", label: "Spanish" },
] as const;

const currencies = [
  { value: "USD", label: "USD — US Dollar" },
  { value: "EUR", label: "EUR — Euro" },
  { value: "SAR", label: "SAR — Saudi Riyal" },
] as const;

const notificationOptions = [
  {
    name: "emailAlerts" as const,
    title: "Email alerts",
    description: "Get notified about fills, deposits, and withdrawals.",
    icon: Mail,
  },
  {
    name: "pushAlerts" as const,
    title: "Push alerts for AI signals",
    description: "Receive push notifications when strong signals fire.",
    icon: Bell,
  },
  {
    name: "aiDigest" as const,
    title: "Daily AI market digest",
    description: "A morning summary of setups and market movers.",
    icon: Sparkles,
  },
];

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
        className="grid gap-4"
      >
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <UserRound className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle>Account</CardTitle>
                <CardDescription>
                  Update how your profile appears across TrustAI.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-1">
            <FormTextField
              control={form.control}
              name="displayName"
              label="Display name"
              autoComplete="name"
              inputClassName="h-12 rounded-xl bg-background px-2.5"
            />
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              inputClassName="h-12 rounded-xl bg-background px-2.5"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Controller
                control={form.control}
                name="language"
                render={({ field }) => (
                  <Field>
                    <FieldLabel htmlFor="language">Language</FieldLabel>
                    <FieldContent>
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) field.onChange(value);
                        }}
                        items={[...languages]}
                      >
                        <SelectTrigger
                          id="language"
                          className="h-12 w-full min-w-0 rounded-xl bg-background px-2.5 py-3 data-[size=default]:h-12"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {languages.map((language) => (
                            <SelectItem
                              key={language.value}
                              value={language.value}
                            >
                              {language.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select
                        value={field.value}
                        onValueChange={(value) => {
                          if (value) field.onChange(value);
                        }}
                        items={[...currencies]}
                      >
                        <SelectTrigger
                          id="currency"
                          className="h-12 w-full min-w-0 rounded-xl bg-background px-2.5 py-3 data-[size=default]:h-12"
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                        >
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldContent>
                  </Field>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
                <Globe2 className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Choose which alerts reach you by email and push.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3 pt-1">
            {notificationOptions.map(
              ({ name, title, description, icon: Icon }) => (
                <Controller
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <label
                      className={cn(
                        "flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-background p-3.5 transition-colors hover:bg-muted/40",
                        field.value && "border-primary/25 bg-primary/3"
                      )}
                    >
                      <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {title}
                        </p>
                        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                          {description}
                        </p>
                      </div>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={(checked) =>
                          field.onChange(checked === true)
                        }
                        className="mt-1"
                      />
                    </label>
                  )}
                />
              )
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3">
          <div className="min-h-5">
            {saved && (
              <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                <Check className="size-4" />
                Settings saved
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="rounded-xl px-5"
            disabled={form.formState.isSubmitting}
          >
            Save changes
          </Button>
        </div>
      </form>
    </div>
  );
}
