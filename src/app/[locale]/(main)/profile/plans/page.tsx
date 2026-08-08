import { getTranslations } from 'next-intl/server';
import {
  getMySubscriptionAction,
  getPlansAction,
} from '@/features/plans/actions/get-plans';
import { PlansView } from '@/features/plans';
import type { MySubscriptionData } from '@/features/plans/types';

const emptySubscription: MySubscriptionData = {
  subscription: null,
  history: [],
};

export default async function PlansPage() {
  const t = await getTranslations('ErrorsPageLoad');
  const [plansResult, subscriptionResult] = await Promise.all([
    getPlansAction(),
    getMySubscriptionAction(),
  ]);

  if (!plansResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('plans')}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {plansResult.message}
        </p>
      </div>
    );
  }

  return (
    <PlansView
      data={plansResult.data}
      subscription={
        subscriptionResult.ok ? subscriptionResult.data : emptySubscription
      }
    />
  );
}
