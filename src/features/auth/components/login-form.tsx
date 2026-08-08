'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldSeparator } from '@/components/ui/field';
import { FormTextField } from '@/shared/components/form-text-field';
import { FormPasswordField } from '@/shared/components/form-password-field';
import { SubmitButton } from '@/shared/components/submit-button';
import { OAuthButtons } from '@/features/auth/components/oauth-buttons';
import { loginAction } from '@/features/auth/actions/login';
import { startEmailVerificationAction } from '@/features/auth/actions/send-verification-code';
import {
  loginSchema,
  type LoginFormValues,
} from '@/features/auth/schemas/auth';
import { LocaleSwitcher } from '@/shared/components/locale-switcher';

export function LoginForm() {
  const t = useTranslations('AuthLogin');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  function onSubmit(values: LoginFormValues) {
    startTransition(async () => {
      const result = await loginAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof LoginFormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      if (!result.data.email_verified) {
        const started = await startEmailVerificationAction({
          email: result.data.email,
          token: result.data.token,
          remember: values.remember,
        });

        if (!started.ok) {
          toast.error(started.message);
          return;
        }

        toast.message(t('toastVerifyEmail'));
        router.push('/verify-email');
        return;
      }

      router.push('/');
      router.refresh();
    });
  }

  return (
    <>
      <div className="mb-6 flex justify-end">
        <LocaleSwitcher className="bg-card h-9 min-w-32 rounded-[12px]!" />
      </div>

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
          placeholder={t('emailPlaceholder')}
          inputClassName="h-12 rounded-[12px]! bg-card px-3"
        />

        <FormPasswordField
          control={form.control}
          name="password"
          label={tCommon('password')}
          autoComplete="current-password"
          placeholder={t('passwordPlaceholder')}
          inputClassName="h-12 rounded-[12px]! bg-card px-3"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Controller
            control={form.control}
            name="remember"
            render={({ field }) => (
              <label className="text-muted-foreground flex items-center gap-2 text-sm">
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) =>
                    field.onChange(checked === true)
                  }
                />
                {t('rememberMe')}
              </label>
            )}
          />
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-medium hover:underline"
          >
            {t('forgotPassword')}
          </Link>
        </div>

        <SubmitButton
          loading={pending || form.formState.isSubmitting}
          loadingText={t('submitting')}
        >
          {t('submit')}
        </SubmitButton>

        <div className="space-y-4 pt-1">
          <FieldSeparator className="my-0 h-auto py-1">
            {t('orContinueWith')}
          </FieldSeparator>
          <OAuthButtons />
        </div>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {t('noAccount')}{' '}
        <Link
          href="/register"
          className="text-primary font-semibold hover:underline"
        >
          {t('createAccount')}
        </Link>
      </p>
    </>
  );
}
