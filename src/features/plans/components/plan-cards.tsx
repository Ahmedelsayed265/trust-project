import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlanFeaturesList } from '@/features/plans/components/plan-features';
import { SubscribePlanButton } from '@/features/plans/components/subscribe-plan-button';
import { PlanIcon } from '@/features/plans/lib/plan-icons';
import type { Plan } from '@/features/plans/types';
import { cn } from '@/lib/utils';

function PlanCard({ plan }: { plan: Plan }) {
  const isHighlighted = plan.is_current || plan.is_popular;
  const href = `/profile/plans/${encodeURIComponent(plan.key)}`;

  return (
    <Card
      className={cn(
        'relative gap-0 overflow-hidden py-0 transition-colors',
        isHighlighted
          ? 'border-primary bg-primary/3 dark:bg-primary/10 z-1'
          : 'border-border',
      )}
    >
      {plan.is_popular ? (
        <div className="bg-primary text-primary-foreground px-3 py-2 text-center text-[11px] font-bold tracking-[0.14em] uppercase">
          Most Popular
        </div>
      ) : null}

      <CardHeader className="gap-4 pt-5">
        <Link href={href} className="block space-y-4 outline-none">
          <div className="flex items-start justify-between gap-3">
            <div
              className={cn(
                'flex size-11 items-center justify-center rounded-[12px]',
                isHighlighted
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-primary/10 text-primary',
              )}
            >
              <PlanIcon name={plan.icon} className="size-5" />
            </div>
            {plan.is_current ? (
              <span className="border-primary/20 bg-primary/10 text-primary rounded-md border px-2 py-0.5 text-[11px] font-semibold">
                Active
              </span>
            ) : null}
          </div>

          <div>
            <CardTitle className="text-lg hover:underline">
              {plan.name}
            </CardTitle>
            <CardDescription className="mt-1.5 text-sm leading-relaxed">
              {plan.tagline}
            </CardDescription>
          </div>

          <p className="text-foreground text-3xl font-bold tracking-tight">
            ${plan.price_monthly}
            <span className="text-muted-foreground text-sm font-medium">
              {' '}
              /month
            </span>
          </p>
        </Link>

        <SubscribePlanButton plan={plan} />
      </CardHeader>

      <CardContent className="pb-5">
        <div className="border-border border-t pt-4">
          <PlanFeaturesList features={plan.features} />
        </div>
      </CardContent>
    </Card>
  );
}

export function PlanCards({ plans }: { plans: Plan[] }) {
  return (
    <section className="space-y-4">
      <h2 className="text-foreground text-base font-semibold sm:text-lg">
        Choose the plan that fits your trading journey.
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </section>
  );
}
