'use client';

import { useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Bell, Check, Globe2, Mail, Sparkles, UserRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FormTextField } from '@/shared/components/form-text-field';
import { PageHeader } from '@/shared/components/page-header';
import { updateUserProfileAction } from '@/features/settings/actions/update-user-profile';
import { updateUserSettingsAction } from '@/features/settings/actions/update-user-settings';
import {
  settingsSchema,
  type SettingsFormValues,
} from '@/features/settings/schemas/settings';
import type { UserSettings } from '@/features/settings/types';
import { cn } from '@/lib/utils';

const notificationOptions = [
  {
    name: 'emailAlerts' as const,
    title: 'Email alerts',
    description: 'Get notified about fills and provider account sync events.',
    icon: Mail,
  },
  {
    name: 'pushAlerts' as const,
    title: 'Push alerts for AI signals',
    description: 'Receive push notifications when strong signals fire.',
    icon: Bell,
  },
  {
    name: 'aiDigest' as const,
    title: 'Daily AI market digest',
    description: 'A morning summary of setups and market movers.',
    icon: Sparkles,
  },
];

type SettingsViewProps = {
  data: UserSettings;
  profile: {
    first_name: string;
    last_name: string;
    phone: string | null;
    country: string | null;
  };
};

function mapServerField(field: string): keyof SettingsFormValues | null {
  switch (field) {
    case 'first_name':
      return 'firstName';
    case 'last_name':
      return 'lastName';
    case 'display_name':
      return 'displayName';
    case 'email_alerts':
      return 'emailAlerts';
    case 'push_alerts':
      return 'pushAlerts';
    case 'ai_digest':
      return 'aiDigest';
    case 'phone':
    case 'country':
    case 'language':
    case 'currency':
    case 'email':
      return field;
    default:
      return null;
  }
}

export function SettingsView({ data, profile }: SettingsViewProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();

  const languages = data.options.languages;
  const currencies = data.options.currencies;

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      firstName: profile.first_name,
      lastName: profile.last_name,
      phone: profile.phone ?? '',
      country: profile.country ?? '',
      displayName: data.display_name,
      email: data.email,
      language: data.language,
      currency: data.currency,
      emailAlerts: data.email_alerts,
      pushAlerts: data.push_alerts,
      aiDigest: data.ai_digest,
    },
  });

  function applyServerErrors(
    errors: Record<string, string[] | undefined> | undefined,
  ) {
    if (!errors) return;
    for (const [field, messages] of Object.entries(errors)) {
      const message = messages?.[0];
      const formField = mapServerField(field);
      if (!message || !formField) continue;
      form.setError(formField, { type: 'server', message });
    }
  }

  function onSubmit(values: SettingsFormValues) {
    startTransition(async () => {
      const profileResult = await updateUserProfileAction({
        first_name: values.firstName,
        last_name: values.lastName,
        phone: values.phone,
        country: values.country.toUpperCase(),
      });

      if (!profileResult.ok) {
        applyServerErrors(profileResult.errors);
        toast.error(profileResult.message);
        return;
      }

      const settingsResult = await updateUserSettingsAction({
        display_name: values.displayName,
        language: values.language,
        currency: values.currency,
        email_alerts: values.emailAlerts,
        push_alerts: values.pushAlerts,
        ai_digest: values.aiDigest,
      });

      if (!settingsResult.ok) {
        applyServerErrors(settingsResult.errors);
        toast.error(settingsResult.message);
        return;
      }

      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
      toast.success('Settings saved.');
      router.refresh();
    });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Settings"
        description="Manage account defaults and notification preferences."
      />

      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <Card>
          <CardHeader className="border-border border-b">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
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
            <div className="grid gap-4 sm:grid-cols-2">
              <FormTextField
                control={form.control}
                name="firstName"
                label="First name"
                autoComplete="given-name"
                inputClassName="h-12 rounded-[12px]! bg-background px-2.5"
              />
              <FormTextField
                control={form.control}
                name="lastName"
                label="Last name"
                autoComplete="family-name"
                inputClassName="h-12 rounded-[12px]! bg-background px-2.5"
              />
            </div>

            <FormTextField
              control={form.control}
              name="displayName"
              label="Display name"
              autoComplete="nickname"
              inputClassName="h-12 rounded-[12px]! bg-background px-2.5"
            />

            <FormTextField
              control={form.control}
              name="email"
              label="Email"
              type="email"
              autoComplete="email"
              disabled
              description="Contact support to change your email address."
              inputClassName="h-12 rounded-[12px]! bg-background px-2.5"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <FormTextField
                control={form.control}
                name="phone"
                label="Phone"
                type="tel"
                autoComplete="tel"
                inputClassName="h-12 rounded-[12px]! bg-background px-2.5"
              />
              <FormTextField
                control={form.control}
                name="country"
                label="Country"
                placeholder="EG"
                autoComplete="country"
                description="2-letter country code"
                inputClassName="h-12 rounded-[12px]! bg-background px-2.5 uppercase"
              />
            </div>

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
                          className="bg-background h-12 w-full min-w-0 rounded-[12px]! px-2.5 py-3 data-[size=default]:h-12"
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
                          className="bg-background h-12 w-full min-w-0 rounded-[12px]! px-2.5 py-3 data-[size=default]:h-12"
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
          <CardHeader className="border-border border-b">
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
                        'border-border bg-background hover:bg-muted/40 flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition-colors',
                        field.value && 'border-primary/25 bg-primary/3',
                      )}
                    >
                      <div className="bg-muted text-muted-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="size-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-foreground text-sm font-semibold">
                          {title}
                        </p>
                        <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
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
              ),
            )}
          </CardContent>
        </Card>

        <div className="border-border bg-card flex items-center justify-between gap-3 rounded-xl border px-4 py-3">
          <div className="min-h-5">
            {saved && (
              <p className="text-success inline-flex items-center gap-1.5 text-sm font-medium">
                <Check className="size-4" />
                Settings saved
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="rounded-xl px-5"
            disabled={pending || form.formState.isSubmitting}
          >
            {pending ? 'Saving…' : 'Save changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}
