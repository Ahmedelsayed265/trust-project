'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { cancelSubscriptionAction } from '@/features/plans/actions/get-plans';

export function CancelSubscriptionButton({ planName }: { planName: string }) {
  const t = useTranslations('Plans');
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await cancelSubscriptionAction();

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(t('toastCancelled'));
      setOpen(false);
      router.refresh();
    });
  }

  return (
    <>
      <Button
        variant="outline"
        className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-xl"
        onClick={() => setOpen(true)}
      >
        {t('cancelButton')}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md" side="right">
          <SheetHeader>
            <SheetTitle>{t('cancelTitle')}</SheetTitle>
            <SheetDescription>{t('cancelDesc', { planName })}</SheetDescription>
          </SheetHeader>

          <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              {t('keepPlan')}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              disabled={pending}
              onClick={onConfirm}
            >
              {pending ? t('cancelling') : t('cancelSubscription')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
