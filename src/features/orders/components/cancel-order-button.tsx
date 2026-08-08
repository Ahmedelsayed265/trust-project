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
import { cancelOrderAction } from '@/features/orders/actions/get-orders';
import { cn } from '@/lib/utils';

type CancelOrderButtonProps = {
  orderId: string;
  providerId?: string;
  symbol: string;
  className?: string;
  label?: string;
  fullWidth?: boolean;
  redirectToOrders?: boolean;
  onCancelled?: (orderId: string) => void;
};

export function CancelOrderButton({
  orderId,
  providerId,
  symbol,
  className,
  label = 'Cancel Order',
  fullWidth = true,
  redirectToOrders = false,
  onCancelled,
}: CancelOrderButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function onConfirm() {
    startTransition(async () => {
      const result = await cancelOrderAction({
        id: orderId,
        provider_id: providerId,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(`Canceled ${symbol} order.`);
      setOpen(false);
      onCancelled?.(orderId);

      if (redirectToOrders) {
        router.push('/orders');
        router.refresh();
        return;
      }

      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className={cn(
          'border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive h-10 rounded-xl',
          fullWidth && 'w-full sm:w-auto',
          className,
        )}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
      >
        {label}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Cancel order?</SheetTitle>
            <SheetDescription>
              This will cancel your {symbol} order #{orderId}. This action
              cannot be undone.
            </SheetDescription>
          </SheetHeader>

          <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Keep order
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
