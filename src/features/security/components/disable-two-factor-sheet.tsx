'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { disableTwoFactorAction } from '@/features/security/actions/two-factor';

export function DisableTwoFactorSheet({
  open,
  onOpenChange,
  onDisabled,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDisabled: () => void;
}) {
  const [code, setCode] = useState('');
  const [pending, startTransition] = useTransition();

  function handleOpenChange(next: boolean) {
    if (!next) setCode('');
    onOpenChange(next);
  }

  function onConfirm() {
    if (code.trim().length < 6) {
      toast.error('Enter a TOTP or recovery code.');
      return;
    }

    startTransition(async () => {
      const result = await disableTwoFactorAction({ code });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success('Two-factor authentication disabled.');
      onDisabled();
    });
  }

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md" side="right">
        <SheetHeader>
          <SheetTitle>Disable two-factor?</SheetTitle>
          <SheetDescription>
            Enter a current authenticator code or an unused recovery code.
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-4 px-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="disable-2fa-code">
              Authenticator or recovery code
            </Label>
            <Input
              id="disable-2fa-code"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="123456 or recovery code"
              autoComplete="one-time-code"
              className="bg-background h-12 rounded-xl px-2.5"
            />
          </div>
        </div>

        <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={pending}
            onClick={() => handleOpenChange(false)}
          >
            Keep enabled
          </Button>
          <Button
            type="button"
            variant="destructive"
            className="rounded-xl"
            disabled={pending || code.trim().length < 6}
            onClick={onConfirm}
          >
            {pending ? 'Disabling…' : 'Disable 2FA'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
