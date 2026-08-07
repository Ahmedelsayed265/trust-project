'use client';

import { createElement, useState, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Check,
  Clock3,
  Mail,
  MessageCircle,
  MessagesSquare,
  Phone,
  type LucideIcon,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { submitContactAction } from '@/features/contact/actions/submit-contact';
import {
  contactSchema,
  type ContactFormValues,
} from '@/features/contact/schemas/contact';
import { FormTextField } from '@/shared/components/form-text-field';
import { PageHeader } from '@/shared/components/page-header';
import { useCurrentUser } from '@/shared/providers/user-provider';
import { useAppSettings } from '@/shared/providers/app-settings-provider';
import { cn } from '@/lib/utils';

const categories = [
  { value: 'account', label: 'Account & verification' },
  { value: 'trading', label: 'Trading & orders' },
  { value: 'billing', label: 'Billing & plans' },
  { value: 'technical', label: 'Technical issue' },
  { value: 'other', label: 'Other' },
] as const;

type SupportChannel = {
  title: string;
  description: string;
  icon: LucideIcon;
  meta: string;
};

export function ContactView() {
  const user = useCurrentUser();
  const settings = useAppSettings();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      category: 'account',
      subject: '',
      message: '',
    },
  });

  const supportChannels: SupportChannel[] = [
    {
      title: 'Email support',
      description: 'We typically reply within a few hours.',
      icon: Mail,
      meta: settings.support_email,
    },
    ...(settings.support_phone
      ? [
          {
            title: 'Phone',
            description: 'Call us during support hours.',
            icon: Phone,
            meta: settings.support_phone,
          },
        ]
      : []),
    ...(settings.whatsapp
      ? [
          {
            title: 'WhatsApp',
            description: 'Message us on WhatsApp.',
            icon: MessageCircle,
            meta: settings.whatsapp,
          },
        ]
      : []),
    {
      title: 'Live hours',
      description: 'Priority help for Premium members.',
      icon: Clock3,
      meta: 'Mon–Fri · 9:00–18:00 UTC',
    },
    {
      title: 'Ticket updates',
      description: 'Track replies in your notifications.',
      icon: MessagesSquare,
      meta: 'In-app alerts enabled',
    },
  ];

  function onSubmit(values: ContactFormValues) {
    setSuccessMessage(null);

    startTransition(async () => {
      const result = await submitContactAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            const message = messages?.[0];
            if (!message) continue;
            form.setError(field as keyof ContactFormValues, {
              type: 'server',
              message,
            });
          }
        }
        toast.error(result.message);
        return;
      }

      setSuccessMessage(result.data.message);
      form.reset({
        name: user.name,
        email: user.email,
        category: 'account',
        subject: '',
        message: '',
      });
    });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Contact Support"
        description="Tell us what's going on and we'll get back to you soon."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="border-border border-b">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                <MessageCircle className="size-5" />
              </div>
              <div className="min-w-0">
                <CardTitle>Send a message</CardTitle>
                <CardDescription>
                  Include as much detail as you can so we can help faster.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormTextField
                  control={form.control}
                  name="name"
                  label="Name"
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
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Controller
                  control={form.control}
                  name="category"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid || undefined}>
                      <FieldLabel htmlFor="category">Category</FieldLabel>
                      <FieldContent>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            if (value) field.onChange(value);
                          }}
                          items={[...categories]}
                        >
                          <SelectTrigger
                            id="category"
                            className="bg-background h-12 w-full min-w-0 rounded-xl px-2.5 py-3 data-[size=default]:h-12"
                          >
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            alignItemWithTrigger={false}
                          >
                            {categories.map((category) => (
                              <SelectItem
                                key={category.value}
                                value={category.value}
                              >
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error && (
                          <FieldError>{fieldState.error.message}</FieldError>
                        )}
                      </FieldContent>
                    </Field>
                  )}
                />

                <FormTextField
                  control={form.control}
                  name="subject"
                  label="Subject"
                  placeholder="Brief summary of the issue"
                  inputClassName="h-12 rounded-xl bg-background px-2.5"
                />
              </div>

              <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid || undefined}>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <FieldContent>
                      <textarea
                        {...field}
                        id="message"
                        rows={7}
                        placeholder="Describe what happened, what you expected, and any order or asset details."
                        aria-invalid={fieldState.invalid}
                        className={cn(
                          'border-input bg-background placeholder:text-muted-foreground focus-visible:border-input aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 w-full min-w-0 resize-y rounded-xl border px-2.5 py-3 text-sm transition-colors outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:ring-3',
                        )}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <div className="border-border flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <div className="min-h-5">
                  {successMessage ? (
                    <p className="text-success inline-flex items-center gap-1.5 text-sm font-medium">
                      <Check className="size-4 shrink-0" />
                      {successMessage}
                    </p>
                  ) : null}
                </div>
                <Button
                  type="submit"
                  className="rounded-xl px-5"
                  disabled={pending}
                >
                  {pending ? 'Sending…' : 'Send message'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {supportChannels.map((channel) => (
            <Card key={channel.title}>
              <CardContent className="flex items-start gap-3 pt-1">
                <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
                  {createElement(channel.icon, { className: 'size-5' })}
                </div>
                <div className="min-w-0">
                  <p className="text-foreground text-sm font-semibold">
                    {channel.title}
                  </p>
                  <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
                    {channel.description}
                  </p>
                  <p className="text-primary mt-2 text-xs font-medium">
                    {channel.meta}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
