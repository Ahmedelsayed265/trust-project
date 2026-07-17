"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Check,
  Clock3,
  Mail,
  MessageCircle,
  MessagesSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
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
  contactSchema,
  type ContactFormValues,
} from "@/features/contact/schemas/contact";
import { cn } from "@/lib/utils";

const categories = [
  { value: "account", label: "Account & verification" },
  { value: "trading", label: "Trading & orders" },
  { value: "billing", label: "Billing & plans" },
  { value: "technical", label: "Technical issue" },
  { value: "other", label: "Other" },
] as const;

const supportChannels = [
  {
    title: "Email support",
    description: "We typically reply within a few hours.",
    icon: Mail,
    meta: "support@trustai.app",
  },
  {
    title: "Live hours",
    description: "Priority help for Premium members.",
    icon: Clock3,
    meta: "Mon–Fri · 9:00–18:00 UTC",
  },
  {
    title: "Ticket updates",
    description: "Track replies in your notifications.",
    icon: MessagesSquare,
    meta: "In-app alerts enabled",
  },
];

export function ContactView() {
  const [sent, setSent] = useState(false);
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: currentUser.name,
      email: currentUser.email,
      category: "account",
      subject: "",
      message: "",
    },
  });

  function onSubmit(_values: ContactFormValues) {
    setSent(true);
    form.reset({
      name: currentUser.name,
      email: currentUser.email,
      category: "account",
      subject: "",
      message: "",
    });
    window.setTimeout(() => setSent(false), 3000);
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Contact Support"
        description="Tell us what's going on and we'll get back to you soon."
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="border-b border-border">
            <div className="flex items-start gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-5"
            >
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
                            className="h-12 w-full min-w-0 rounded-xl bg-background px-2.5 py-3 data-[size=default]:h-12"
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
                          "w-full min-w-0 resize-y rounded-xl border border-input bg-background px-2.5 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-input focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30"
                        )}
                      />
                      {fieldState.error && (
                        <FieldError>{fieldState.error.message}</FieldError>
                      )}
                    </FieldContent>
                  </Field>
                )}
              />

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                <div className="min-h-5">
                  {sent && (
                    <p className="inline-flex items-center gap-1.5 text-sm font-medium text-success">
                      <Check className="size-4" />
                      Message sent — we'll reply by email
                    </p>
                  )}
                </div>
                <Button
                  type="submit"
                  className="rounded-xl px-5"
                  disabled={form.formState.isSubmitting}
                >
                  Send message
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {supportChannels.map(({ title, description, icon: Icon, meta }) => (
            <Card key={title}>
              <CardContent className="flex items-start gap-3 pt-1">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-foreground">{title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {description}
                  </p>
                  <p className="mt-2 text-xs font-medium text-primary">{meta}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
