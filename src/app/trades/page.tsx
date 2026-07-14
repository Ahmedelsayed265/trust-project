import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { TradesView } from "@/features/trades";

export default function TradesPage() {
  return (
    <DashboardShell>
      <TradesView />
    </DashboardShell>
  );
}
