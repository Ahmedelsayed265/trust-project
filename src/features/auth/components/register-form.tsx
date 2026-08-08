'use client';

import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { FormTextField } from '@/shared/components/form-text-field';
import { FormPasswordField } from '@/shared/components/form-password-field';
import { SubmitButton } from '@/shared/components/submit-button';
import { OAuthButtons } from '@/features/auth/components/oauth-buttons';
import { registerAction } from '@/features/auth/actions/register';
import { startEmailVerificationAction } from '@/features/auth/actions/send-verification-code';
import {
  Field,
  FieldContent,
  FieldError,
  FieldSeparator,
} from '@/components/ui/field';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/schemas/auth';

const authInputClassName = 'h-12 rounded-[12px]! bg-card px-3';

export function RegisterForm() {
  const t = useTranslations('AuthRegister');
  const tCommon = useTranslations('Common');
  const tLogin = useTranslations('AuthLogin');
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      terms: false,
    },
  });

  function onSubmit(values: RegisterFormValues) {
    startTransition(async () => {
      const result = await registerAction(values);

      if (!result.ok) {
        if (result.errors) {
          for (const [field, messages] of Object.entries(result.errors)) {
            form.setError(field as keyof RegisterFormValues, {
              type: 'server',
              message: messages[0],
            });
          }
        }
        toast.error(result.message);
        return;
      }

      const started = await startEmailVerificationAction({
        email: result.data.email,
        token: result.data.token,
        remember: true,
      });

      if (!started.ok) {
        toast.error(started.message);
        return;
      }

      toast.success(t('toastCreated'));
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormTextField
            control={form.control}
            name="first_name"
            label={t('firstName')}
            autoComplete="given-name"
            placeholder={t('firstNamePlaceholder')}
            inputClassName={authInputClassName}
          />

          <FormTextField
            control={form.control}
            name="last_name"
            label={t('lastName')}
            autoComplete="family-name"
            placeholder={t('lastNamePlaceholder')}
            inputClassName={authInputClassName}
          />
        </div>

        <FormTextField
          control={form.control}
          name="email"
          label={tCommon('email')}
          type="email"
          autoComplete="email"
          placeholder={tLogin('emailPlaceholder')}
          inputClassName={authInputClassName}
        />

        <FormPasswordField
          control={form.control}
          name="password"
          label={tCommon('password')}
          autoComplete="new-password"
          placeholder={t('passwordPlaceholder')}
          inputClassName={authInputClassName}
        />

        <FormPasswordField
          control={form.control}
          name="password_confirmation"
          label={t('confirmPassword')}
          autoComplete="new-password"
          placeholder={t('confirmPlaceholder')}
          inputClassName={authInputClassName}
        />

        <Controller
          control={form.control}
          name="terms"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldContent>
                <label className="text-muted-foreground flex items-start gap-2.5 text-sm">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    className="mt-0.5 cursor-pointer"
                  />
                  <span>
                    {t('agreePrefix')}{' '}
                    <Link
                      href="/terms"
                      className="text-primary font-medium hover:underline"
                    >
                      {t('termsOfService')}
                    </Link>{' '}
                    {t('and')}{' '}
                    <Link
                      href="/privacy"
                      className="text-primary font-medium hover:underline"
                    >
                      {t('privacyPolicy')}
                    </Link>
                  </span>
                </label>

                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </FieldContent>
            </Field>
          )}
        />

        <SubmitButton
          loading={pending || form.formState.isSubmitting}
          loadingText={t('submitting')}
        >
          {t('submit')}
        </SubmitButton>

        <div className="space-y-4 pt-1">
          <FieldSeparator className="my-0 h-auto py-1">
            {tLogin('orContinueWith')}
          </FieldSeparator>
          <OAuthButtons />
        </div>
      </form>

      <p className="text-muted-foreground mt-6 text-center text-sm">
        {t('haveAccount')}{' '}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          {t('signIn')}
        </Link>
      </p>
    </>
  );
}
