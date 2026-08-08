'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { FormTextField } from '@/shared/components/form-text-field';
import { SubmitButton } from '@/shared/components/submit-button';
import { forgotPasswordAction } from '@/features/auth/actions/forgot-password';
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from '@/features/auth/schemas/auth';

export function ForgotPasswordForm() {
  const t = useTranslations('AuthForgotPassword');
  const tCommon = useTranslations('Common');
  const tLogin = useTranslations('AuthLogin');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  function onSubmit(values: ForgotPasswordFormValues) {
    startTransition(async () => {
      const result = await forgotPasswordAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof ForgotPasswordFormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      toast.success(t('toastSent'));
      router.push('/verify-email');
    });
  }

  return (
    <>
      <div className="mb-8 space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          {t('title')}
        </h2>
        <p className="text-muted-foreground text-sm">{t('subtitle')}</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormTextField
          control={form.control}
          name="email"
          label={tCommon('email')}
          type="email"
          autoComplete="email"
          placeholder={tLogin('emailPlaceholder')}
          inputClassName="h-12 rounded-[12px]! bg-card px-3"
        />

        <SubmitButton loading={pending} loadingText={t('submitting')}>
          {t('submit')}
        </SubmitButton>
      </form>
    </>
  );
}
