'use client';

import { useEffect, useState, useTransition } from 'react';
import { Check, Copy } from 'lucide-react';
import QRCode from 'qrcode';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { confirmTwoFactorAction } from '@/features/security/actions/two-factor';
import type { TwoFactorEnableData } from '@/features/security/types';

export function EnableTwoFactorSheet({
  open,
  setup,
  onOpenChange,
  onConfirmed,
}: {
  open: boolean;
  setup: TwoFactorEnableData | null;
  onOpenChange: (open: boolean) => void;
  onConfirmed: (codes: string[]) => void;
}) {
  const [code, setCode] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!setup?.provisioning_uri) {
      setQrDataUrl(null);
      return;
    }

    let cancelled = false;
    void QRCode.toDataURL(setup.provisioning_uri, {
      width: 200,
      margin: 1,
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [setup?.provisioning_uri]);

  useEffect(() => {
    if (!open) {
      setCode('');
      setCopied(false);
    }
  }, [open]);

  async function copyKey() {
    if (!setup?.manual_entry_key) return;
    try {
      await navigator.clipboard.writeText(setup.manual_entry_key);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error('Could not copy key.');
    }
  }

  function onConfirm() {
    if (code.length !== 6) {
      toast.error('Enter the 6-digit code from your authenticator.');
      return;
    }

    startTransition(async () => {
      const result = await confirmTwoFactorAction({ code });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success('Two-factor authentication enabled.');
      onConfirmed(result.data.recovery_codes);
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>Set up authenticator</SheetTitle>
          <SheetDescription>
            Scan the QR code, then enter a 6-digit code to confirm.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-5 overflow-y-auto px-4 py-2">
          {qrDataUrl ? (
            <div className="flex justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrDataUrl}
                alt="Two-factor authentication QR code"
                className="border-border size-48 rounded-xl border bg-white p-2"
              />
            </div>
          ) : (
            <div className="border-border bg-muted/40 mx-auto size-48 animate-pulse rounded-xl border" />
          )}

          <div className="space-y-2">
            <p className="text-foreground text-sm font-medium">
              Manual entry key
            </p>
            <div className="flex gap-2">
              <code className="border-border bg-muted/40 text-foreground flex-1 truncate rounded-xl border px-3 py-3 text-xs font-semibold tracking-wide">
                {setup?.manual_entry_key ?? '—'}
              </code>
              <Button
                type="button"
                variant="outline"
                className="h-auto shrink-0 rounded-xl px-3"
                onClick={copyKey}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-foreground text-sm font-medium">
              Verification code
            </p>
            <InputOTP
              maxLength={6}
              value={code}
              onChange={setCode}
              containerClassName="justify-center"
            >
              <InputOTPGroup>
                {Array.from({ length: 6 }).map((_, index) => (
                  <InputOTPSlot key={index} index={index} />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        </div>

        <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={pending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="rounded-xl"
            disabled={pending || code.length !== 6}
            onClick={onConfirm}
          >
            {pending ? 'Confirming…' : 'Confirm & enable'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
