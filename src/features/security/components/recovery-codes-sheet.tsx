'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Check, Copy } from 'lucide-react';
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

export function RecoveryCodesSheet({
  codes,
  open,
  onOpenChange,
}: {
  codes: string[] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const t = useTranslations('Security');
  const tCommon = useTranslations('Common');
  const [copied, setCopied] = useState(false);

  async function copyAll() {
    if (!codes?.length) return;
    try {
      await navigator.clipboard.writeText(codes.join('\n'));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error(t('toastCopyCodesFailed'));
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>{t('recoveryTitle')}</SheetTitle>
          <SheetDescription>{t('recoveryDesc')}</SheetDescription>
        </SheetHeader>

        <div className="space-y-4 overflow-y-auto px-4 py-2">
          <div className="border-border bg-muted/40 grid grid-cols-2 gap-2 rounded-xl border p-3 font-mono text-sm">
            {(codes ?? []).map((code) => (
              <p
                key={code}
                className="text-foreground text-center font-semibold"
              >
                {code}
              </p>
            ))}
          </div>
        </div>

        <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            onClick={copyAll}
          >
            {copied ? (
              <Check className="size-4" />
            ) : (
              <Copy className="size-4" />
            )}
            {copied ? tCommon('copied') : t('copyCodes')}
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            {t('iveSavedThem')}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
