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
  label,
  fullWidth = true,
  redirectToOrders = false,
  onCancelled,
}: CancelOrderButtonProps) {
  const t = useTranslations('Orders');
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

      toast.success(t('toastCanceled', { symbol }));
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
        {label ?? t('cancelOrder')}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('cancelTitle')}</SheetTitle>
            <SheetDescription>
              {t('cancelDescription', { symbol, orderId })}
            </SheetDescription>
          </SheetHeader>

          <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              {t('keepOrder')}
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl"
              disabled={pending}
              onClick={onConfirm}
            >
              {pending ? t('cancelling') : t('confirmCancel')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
