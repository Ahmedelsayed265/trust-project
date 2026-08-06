import { CalendarDays, Crown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { BillingHistorySheet } from '@/features/plans/components/billing-history-sheet';
import { CancelSubscriptionButton } from '@/features/plans/components/cancel-subscription-button';
import {
  billingCycleLabel,
  SubscriptionStatusBadge,
} from '@/features/plans/lib/subscription-display';
import type { Plan, Subscription } from '@/features/plans/types';

type CurrentPlanCardProps = {
  plan: Plan | null;
  subscription: Subscription | null;
  history: Subscription[];
};

export function CurrentPlanCard({
  plan,
  subscription,
  history,
}: CurrentPlanCardProps) {
  const name = subscription?.plan_name ?? plan?.name;
  const description = subscription?.description ?? plan?.description;
  const price = subscription?.price ?? plan?.price_monthly;
  const currency = subscription?.currency ?? plan?.currency;
  const cycle = subscription?.billing_cycle ?? 'monthly';
  const status = subscription?.status ?? (plan ? 'active' : null);
  const canCancel =
    !!subscription &&
    (subscription.is_usable || subscription.status.toLowerCase() === 'active');

  if (!name) {
    return (
      <Card>
        <CardContent>
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-muted text-muted-foreground flex size-14 shrink-0 items-center justify-center rounded-full">
                <Crown className="size-7" />
              </div>
              <div className="min-w-0">
                <p className="text-muted-foreground text-sm font-medium">
                  Current Plan
                </p>
                <h2 className="text-foreground mt-1 text-xl font-bold tracking-tight">
                  No active plan
                </h2>
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                  Choose a plan below to unlock AI signals and trading tools.
                </p>
              </div>
            </div>
            <BillingHistorySheet history={history} />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex size-14 shrink-0 items-center justify-center rounded-full">
              <Crown className="size-7" />
            </div>
            <div className="min-w-0">
              <p className="text-muted-foreground text-sm font-medium">
                Current Plan
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <h2 className="text-foreground text-xl font-bold tracking-tight">
                  {name}
                </h2>
                {status ? <SubscriptionStatusBadge status={status} /> : null}
              </div>
              {price != null ? (
                <p className="text-muted-foreground mt-1 text-sm">
                  ${price}
                  <span className="text-muted-foreground">
                    {' '}
                    /{billingCycleLabel(cycle)}
                  </span>
                  {currency ? ` · ${currency}` : null}
                  {subscription?.auto_renew ? ' · Auto-renew on' : null}
                </p>
              ) : null}
              {subscription?.renews_at_label ? (
                <p className="text-muted-foreground mt-1 text-sm">
                  Renews {subscription.renews_at_label}
                </p>
              ) : null}
              {description ? (
                <p className="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
                  {description}
                </p>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center lg:flex-col lg:items-end">
            {subscription?.renews_at_label ? (
              <div className="bg-muted/50 text-muted-foreground flex items-center gap-2 rounded-xl px-3 py-2 text-sm">
                <CalendarDays className="text-primary size-4 shrink-0" />
                <span>
                  Next billing date{' '}
                  <span className="text-foreground font-semibold">
                    {subscription.renews_at_label}
                  </span>
                </span>
              </div>
            ) : null}
            <div className="flex flex-wrap gap-2 sm:justify-end">
              <BillingHistorySheet history={history} />
              {canCancel ? <CancelSubscriptionButton planName={name} /> : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
