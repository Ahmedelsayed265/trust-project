'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronRight, Loader2, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { FormPasswordField } from '@/shared/components/form-password-field';
import { SubmitButton } from '@/shared/components/submit-button';
import { deleteAccountAction } from '@/features/security/actions/delete-account';

type DeleteAccountFormValues = {
  password: string;
};

export function DeleteAccountCard() {
  const t = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const deleteAccountSchema = useMemo(
    () =>
      z.object({
        password: z.string().min(1, tValidation('enterPassword')),
      }),
    [tValidation],
  );

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: { password: '' },
  });

  function onSubmit(values: DeleteAccountFormValues) {
    startTransition(async () => {
      const result = await deleteAccountAction(values);

      if (!result.ok) {
        if (result.errors?.password?.[0]) {
          form.setError('password', {
            type: 'server',
            message: result.errors.password[0],
          });
        }
        toast.error(result.message);
      }
    });
  }

  function onCancel() {
    setConfirmOpen(false);
    form.reset({ password: '' });
  }

  if (!confirmOpen) {
    return (
      <button
        type="button"
        className="hover:bg-muted/60 flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors"
        onClick={() => setConfirmOpen(true)}
      >
        <div className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-xl">
          <Trash2 className="size-4" />
        </div>
        <div className="min-w-0 flex-1 text-left">
          <p className="text-destructive text-sm font-semibold">
            {t('deleteAccount')}
          </p>
          <p className="text-muted-foreground truncate text-xs">
            {t('deleteAccountDesc')}
          </p>
        </div>
        <ChevronRight className="text-muted-foreground size-4 shrink-0" />
      </button>
    );
  }

  return (
    <div className="space-y-4 px-2 py-1">
      <div className="flex items-start gap-3">
        <div className="bg-destructive/10 text-destructive flex size-9 shrink-0 items-center justify-center rounded-xl">
          {pending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Trash2 className="size-4" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-destructive text-sm font-semibold">
            {t('confirmDelete')}
          </p>
          <p className="text-muted-foreground mt-0.5 text-xs leading-relaxed">
            {t('confirmDeleteBody')}
          </p>
        </div>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormPasswordField
          control={form.control}
          name="password"
          label={t('currentPassword')}
          autoComplete="current-password"
          placeholder={tValidation('enterPassword')}
          inputClassName="bg-background h-11 rounded-xl px-2.5"
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={onCancel}
            disabled={pending}
          >
            {tCommon('cancel')}
          </Button>
          <SubmitButton
            loading={pending}
            loadingText={t('deleting')}
            className="bg-destructive hover:bg-destructive/90 h-9 w-auto rounded-xl px-4 text-white hover:text-white"
          >
            {t('confirmDelete')}
          </SubmitButton>
        </div>
      </form>
    </div>
  );
}
