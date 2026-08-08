'use client';

import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { FormPasswordField } from '@/shared/components/form-password-field';
import { SubmitButton } from '@/shared/components/submit-button';
import {
  backToResetCodeAction,
  resetPasswordAction,
} from '@/features/auth/actions/forgot-password';
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from '@/features/auth/schemas/auth';

const authInputClassName = 'h-12 rounded-[12px]! bg-card px-3';

export function ResetPasswordForm({ email }: { email: string }) {
  const t = useTranslations('AuthResetPassword');
  const tCommon = useTranslations('Common');
  const tRegister = useTranslations('AuthRegister');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      password_confirmation: '',
    },
  });

  function onSubmit(values: ResetPasswordFormValues) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof ResetPasswordFormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      toast.success(t('toastUpdated'));
      router.push('/login');
      router.refresh();
    });
  }

  function onBack() {
    startTransition(async () => {
      await backToResetCodeAction();
      router.push('/verify-email');
      router.refresh();
    });
  }

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        disabled={pending}
        className="text-muted-foreground hover:text-foreground mb-6 inline-flex items-center gap-1.5 text-sm font-medium disabled:opacity-60"
      >
        <ArrowLeft className="size-4" />
        {tCommon('back')}
      </button>

      <div className="mb-8 space-y-2">
        <h2 className="text-foreground text-2xl font-bold tracking-tight">
          {t('title')}
        </h2>
        <p className="text-muted-foreground text-sm">
          {t('subtitle', { email })}
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormPasswordField
          control={form.control}
          name="password"
          label={t('newPassword')}
          autoComplete="new-password"
          placeholder={tRegister('passwordPlaceholder')}
          inputClassName={authInputClassName}
        />

        <FormPasswordField
          control={form.control}
          name="password_confirmation"
          label={t('confirmPassword')}
          autoComplete="new-password"
          placeholder={tRegister('confirmPlaceholder')}
          inputClassName={authInputClassName}
        />

        <SubmitButton loading={pending} loadingText={t('submitting')}>
          {t('submit')}
        </SubmitButton>
      </form>
    </>
  );
}
