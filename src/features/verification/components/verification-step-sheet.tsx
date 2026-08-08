'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  AddressForm,
  IdentityDocumentForm,
  PersonalDetailsForm,
} from '@/features/verification/components/verification-step-forms';
import type {
  VerificationStep,
  VerificationStepKey,
} from '@/features/verification/types';

export function VerificationStepSheet({
  step,
  open,
  onOpenChange,
}: {
  step: VerificationStep | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('Verification');
  const router = useRouter();
  const stepKey = step?.key as VerificationStepKey | undefined;

  function handleSuccess() {
    onOpenChange(false);
    router.refresh();
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>{step?.title ?? t('stepFallbackTitle')}</SheetTitle>
          <SheetDescription>
            {step?.description ?? t('stepFallbackDesc')}
          </SheetDescription>
        </SheetHeader>

        {stepKey === 'personal_details' ? (
          <PersonalDetailsForm
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
        {stepKey === 'identity_document' ? (
          <IdentityDocumentForm
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
        {stepKey === 'address' ? (
          <AddressForm
            onSuccess={handleSuccess}
            onCancel={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
