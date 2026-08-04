import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { OrdersView } from "@/features/orders";

export default function OrdersPage() {
  return (
    <DashboardShell>
      <OrdersView />
    </DashboardShell>
  );
}
