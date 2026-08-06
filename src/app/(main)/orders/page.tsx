import {
  getOrderFillsAction,
  getOrdersAction,
} from '@/features/orders/actions/get-orders';
import { OrdersView } from '@/features/orders';

export default async function OrdersPage() {
  const [ordersResult, fillsResult] = await Promise.all([
    getOrdersAction({ status: 'all' }),
    getOrderFillsAction({ limit: 20 }),
  ]);

  if (!ordersResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">
          Couldn&apos;t load orders
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {ordersResult.message}
        </p>
      </div>
    );
  }

  return (
    <OrdersView
      initialData={ordersResult.data}
      initialFills={fillsResult.ok ? fillsResult.data : []}
    />
  );
}
