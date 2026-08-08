import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getPlanByKeyAction } from '@/features/plans/actions/get-plans';
import { PlanDetailView } from '@/features/plans/components/plan-detail-view';
import { Button } from '@/components/ui/button';

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const tErrors = await getTranslations('ErrorsPageLoad');
  const tPlans = await getTranslations('Plans');
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  const result = await getPlanByKeyAction(decoded);

  if (!result.ok) {
    return (
      <div className="border-border bg-card mx-auto max-w-md rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{tErrors('plan')}</p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          render={<Link href="/profile/plans" />}
        >
          {tPlans('backToPlans')}
        </Button>
      </div>
    );
  }

  return <PlanDetailView plan={result.data} />;
}
