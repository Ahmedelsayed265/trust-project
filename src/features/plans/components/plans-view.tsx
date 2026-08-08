'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ChevronRight, Info, Lock } from 'lucide-react';
import { CurrentPlanCard } from '@/features/plans/components/current-plan-card';
import { PlanCards } from '@/features/plans/components/plan-cards';
import { PlanComparison } from '@/features/plans/components/plan-comparison';
import type { MySubscriptionData, PlansData } from '@/features/plans/types';

export function PlansView({
  data,
  subscription,
}: {
  data: PlansData;
  subscription: MySubscriptionData;
}) {
  const t = useTranslations('Plans');
  const tCommon = useTranslations('Common');

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 sm:gap-6">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          {t('title')}
        </h1>
        <nav
          className="text-muted-foreground mt-1.5 flex items-center gap-1 text-sm"
          aria-label={tCommon('breadcrumb')}
        >
          <Link href="/profile" className="hover:text-foreground">
            {t('breadcrumbProfile')}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">{t('title')}</span>
        </nav>
      </div>

      <CurrentPlanCard
        plan={data.current_plan}
        subscription={subscription.subscription}
        history={subscription.history}
      />
      <PlanCards plans={data.plans} />
      <PlanComparison plans={data.plans} comparison={data.comparison} />

      <div className="border-border text-muted-foreground flex flex-col gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-1.5 sm:items-center">
          <Info className="mt-0.5 size-3.5 shrink-0 sm:mt-0" />
          {t('footerInclude')}
        </p>
        <p className="flex items-center gap-1.5">
          <Lock className="size-3.5 shrink-0" />
          {t('footerSecure')}
        </p>
      </div>
    </div>
  );
}
