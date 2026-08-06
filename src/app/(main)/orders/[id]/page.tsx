import Link from 'next/link';
import { getOrderByIdAction } from '@/features/orders/actions/get-orders';
import { OrderDetailView } from '@/features/orders/components/order-detail-view';
import { Button } from '@/components/ui/button';

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ provider_id?: string }>;
}) {
  const { id } = await params;
  const { provider_id } = await searchParams;
  const decoded = decodeURIComponent(id);
  const result = await getOrderByIdAction(decoded, provider_id);

  if (!result.ok) {
    return (
      <div className="border-border bg-card mx-auto max-w-md rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load order
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          render={<Link href="/orders" />}
        >
          Back to orders
        </Button>
      </div>
    );
  }

  return <OrderDetailView order={result.data} />;
}
