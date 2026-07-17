import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { SecurityView } from "@/features/security";

export default function SecurityPage() {
  return (
    <DashboardShell>
      <SecurityView />
    </DashboardShell>
  );
}
