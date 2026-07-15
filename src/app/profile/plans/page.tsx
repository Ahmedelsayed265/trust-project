import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { PlansView } from "@/features/plans";

export default function PlansPage() {
  return (
    <DashboardShell>
      <PlansView />
    </DashboardShell>
  );
}
