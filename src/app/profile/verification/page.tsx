import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { VerificationView } from "@/features/verification";

export default function VerificationPage() {
  return (
    <DashboardShell>
      <VerificationView />
    </DashboardShell>
  );
}
