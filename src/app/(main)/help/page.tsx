import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { HelpView } from "@/features/help";

export default function HelpPage() {
  return (
    <DashboardShell>
      <HelpView />
    </DashboardShell>
  );
}
