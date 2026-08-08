'use client';

import { useState, useTransition } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from '@/i18n/navigation';
import { Check, KeyRound } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { changePasswordAction } from '@/features/security/actions/change-password';
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from '@/features/security/schemas/security';
import { FormTextField } from '@/shared/components/form-text-field';

export function ChangePasswordForm({
  passwordChangedAt,
}: {
  passwordChangedAt: string | null;
}) {
  const t = useTranslations('Security');
  const tCommon = useTranslations('Common');
  const locale = useLocale();
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: '',
      password: '',
      password_confirmation: '',
    },
  });

  const changedLabel = passwordChangedAt
    ? new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(new Date(passwordChangedAt))
    : null;

  function onSubmit(values: ChangePasswordValues) {
    startTransition(async () => {
      const result = await changePasswordAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            const message = messages?.[0];
            if (!message) continue;
            form.setError(field as keyof ChangePasswordValues, {
              type: 'server',
              message,
            });
          }
        }
        toast.error(result.message);
        return;
      }

      form.reset();
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
      toast.success(t('toastPasswordUpdated'));
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex items-start gap-3">
          <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
            <KeyRound className="size-5" />
          </div>
          <div>
            <CardTitle>{t('changePassword')}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {changedLabel
                ? t('lastChanged', { date: changedLabel })
                : t('changePasswordHint')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormTextField
            control={form.control}
            name="current_password"
            label={t('currentPassword')}
            type="password"
            autoComplete="current-password"
            inputClassName="h-12 rounded-xl bg-background px-2.5"
          />
          <FormTextField
            control={form.control}
            name="password"
            label={t('newPassword')}
            type="password"
            autoComplete="new-password"
            inputClassName="h-12 rounded-xl bg-background px-2.5"
          />
          <FormTextField
            control={form.control}
            name="password_confirmation"
            label={t('confirmNewPassword')}
            type="password"
            autoComplete="new-password"
            inputClassName="h-12 rounded-xl bg-background px-2.5"
          />
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="min-h-5">
              {saved ? (
                <p className="text-success inline-flex items-center gap-1.5 text-sm font-medium">
                  <Check className="size-4" />
                  {t('passwordUpdated')}
                </p>
              ) : null}
            </div>
            <Button type="submit" className="rounded-xl" disabled={pending}>
              {pending ? tCommon('updating') : t('updatePassword')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
