'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
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

      toast.success('Subscription cancelled.');
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
        Cancel subscription
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md" side="right">
          <SheetHeader>
            <SheetTitle>Cancel subscription?</SheetTitle>
            <SheetDescription>
              This will cancel {planName}. You may lose access to paid features
              at the end of the current billing period.
            </SheetDescription>
          </SheetHeader>

          <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Keep plan
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              disabled={pending}
              onClick={onConfirm}
            >
              {pending ? 'Cancelling…' : 'Confirm cancel'}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
