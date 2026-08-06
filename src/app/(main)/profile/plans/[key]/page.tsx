import Link from 'next/link';
import { getPlanByKeyAction } from '@/features/plans/actions/get-plans';
import { PlanDetailView } from '@/features/plans/components/plan-detail-view';
import { Button } from '@/components/ui/button';

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ key: string }>;
}) {
  const { key } = await params;
  const decoded = decodeURIComponent(key);
  const result = await getPlanByKeyAction(decoded);

  if (!result.ok) {
    return (
      <div className="border-border bg-card mx-auto max-w-md rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load plan
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          render={<Link href="/profile/plans" />}
        >
          Back to plans
        </Button>
      </div>
    );
  }

  return <PlanDetailView plan={result.data} />;
}
