import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { MarketsView } from "@/features/markets";

export default function MarketsPage() {
  return (
    <DashboardShell>
      <MarketsView />
    </DashboardShell>
  );
}
