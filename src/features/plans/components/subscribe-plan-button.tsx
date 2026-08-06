'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
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
import { subscribePlanAction } from '@/features/plans/actions/get-plans';
import { planActionLabel } from '@/features/plans/components/plan-features';
import type { BillingCycle, Plan } from '@/features/plans/types';
import { cn } from '@/lib/utils';

type SubscribePlanButtonProps = {
  plan: Pick<
    Plan,
    'key' | 'name' | 'action' | 'price_monthly' | 'price_yearly' | 'currency'
  >;
  className?: string;
  fullWidth?: boolean;
};

export function SubscribePlanButton({
  plan,
  className,
  fullWidth = true,
}: SubscribePlanButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
  const [autoRenew, setAutoRenew] = useState(true);
  const [pending, startTransition] = useTransition();

  if (plan.action === 'current') {
    return (
      <Button
        className={cn(
          'border-primary/25 bg-primary/10 text-primary hover:bg-primary/15 h-10 rounded-md border disabled:opacity-100',
          fullWidth && 'w-full',
          className,
        )}
        variant="secondary"
        disabled
      >
        <Check className="size-4" strokeWidth={2.5} />
        Current Plan
      </Button>
    );
  }

  const price =
    billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly;
  const actionLabel = planActionLabel(plan.action);

  function onConfirm() {
    startTransition(async () => {
      const result = await subscribePlanAction({
        plan_key: plan.key,
        billing_cycle: billingCycle,
        auto_renew: autoRenew,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      toast.success(
        plan.action === 'downgrade'
          ? `Downgraded to ${plan.name}.`
          : `Subscribed to ${plan.name}.`,
      );
      setOpen(false);
      router.refresh();
      router.push('/profile/plans');
    });
  }

  return (
    <>
      <Button
        className={cn('h-10 rounded-md', fullWidth && 'w-full', className)}
        variant={plan.action === 'upgrade' ? 'default' : 'outline'}
        onClick={() => setOpen(true)}
      >
        {actionLabel}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>
              {actionLabel} to {plan.name}
            </SheetTitle>
            <SheetDescription>
              Choose billing cycle and confirm your subscription.
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-4 px-4 py-2">
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  {
                    value: 'monthly' as const,
                    label: 'Monthly',
                    price: plan.price_monthly,
                  },
                  {
                    value: 'yearly' as const,
                    label: 'Yearly',
                    price: plan.price_yearly,
                  },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setBillingCycle(option.value)}
                  className={cn(
                    'border-border rounded-xl border px-3 py-3 text-left transition-colors',
                    billingCycle === option.value
                      ? 'border-primary bg-primary/10'
                      : 'hover:bg-muted/50',
                  )}
                >
                  <p className="text-foreground text-sm font-semibold">
                    {option.label}
                  </p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    ${option.price}/
                    {option.value === 'yearly' ? 'year' : 'month'}
                  </p>
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={autoRenew}
                onChange={(event) => setAutoRenew(event.target.checked)}
                className="accent-primary size-4 rounded"
              />
              <span className="text-foreground">Auto-renew</span>
            </label>

            <p className="text-muted-foreground text-sm">
              You&apos;ll be billed{' '}
              <span className="text-foreground font-semibold">
                ${price} {plan.currency}
              </span>{' '}
              {billingCycle === 'yearly' ? 'per year' : 'per month'}.
            </p>
          </div>

          <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-xl"
              disabled={pending}
              onClick={onConfirm}
            >
              {pending ? 'Processing…' : `Confirm ${actionLabel.toLowerCase()}`}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
