'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlanFeaturesList } from '@/features/plans/components/plan-features';
import { SubscribePlanButton } from '@/features/plans/components/subscribe-plan-button';
import { PlanIcon } from '@/features/plans/lib/plan-icons';
import type { Plan } from '@/features/plans/types';
import { cn } from '@/lib/utils';

export function PlanDetailView({ plan }: { plan: Plan }) {
  const t = useTranslations('Plans');
  const tCommon = useTranslations('Common');
  const isHighlighted = plan.is_current || plan.is_popular;

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
      <div>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground mb-2 -ml-2 h-8 gap-1.5 px-2"
          render={<Link href="/profile/plans" />}
        >
          <ArrowLeft className="size-3.5" />
          {t('backToPlans')}
        </Button>
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          {plan.name}
        </h1>
        <nav
          className="text-muted-foreground mt-1.5 flex flex-wrap items-center gap-1 text-sm"
          aria-label={tCommon('breadcrumb')}
        >
          <Link href="/profile" className="hover:text-foreground">
            {t('breadcrumbProfile')}
          </Link>
          <ChevronRight className="size-3.5" />
          <Link href="/profile/plans" className="hover:text-foreground">
            {t('title')}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">{plan.name}</span>
        </nav>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card
          className={cn(
            'gap-0 overflow-hidden py-0',
            isHighlighted && 'border-primary bg-primary/3 dark:bg-primary/10',
          )}
        >
          {plan.is_popular ? (
            <div className="bg-primary text-primary-foreground px-3 py-2 text-center text-[11px] font-bold tracking-[0.14em] uppercase">
              {t('mostPopular')}
            </div>
          ) : null}

          <CardHeader className="gap-4 pt-5">
            <div className="flex items-start justify-between gap-3">
              <div
                className={cn(
                  'flex size-12 items-center justify-center rounded-[12px]',
                  isHighlighted
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-primary/10 text-primary',
                )}
              >
                <PlanIcon name={plan.icon} className="size-6" />
              </div>
              <div className="flex flex-wrap justify-end gap-1.5">
                {plan.is_current ? (
                  <Badge className="bg-primary/10 text-primary border-0">
                    {t('active')}
                  </Badge>
                ) : null}
                <Badge variant="secondary" className="border-0 capitalize">
                  {t('tier', { tier: plan.tier })}
                </Badge>
              </div>
            </div>

            <div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">
                {plan.tagline}
              </p>
            </div>

            <div className="flex flex-wrap items-end gap-4">
              <p className="text-foreground text-3xl font-bold tracking-tight">
                ${plan.price_monthly}
                <span className="text-muted-foreground text-sm font-medium">
                  {' '}
                  /{t('perMonth')}
                </span>
              </p>
              <p className="text-muted-foreground pb-1 text-sm">
                {t('orYearly', {
                  price: plan.price_yearly,
                  currency: plan.currency,
                })}
              </p>
            </div>

            <SubscribePlanButton
              plan={plan}
              fullWidth={false}
              className="sm:min-w-44"
            />
          </CardHeader>

          <CardContent className="pb-5">
            <p className="text-muted-foreground border-border border-t pt-4 text-sm leading-relaxed">
              {plan.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('whatsIncluded')}</CardTitle>
          </CardHeader>
          <CardContent>
            <PlanFeaturesList features={plan.features} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
