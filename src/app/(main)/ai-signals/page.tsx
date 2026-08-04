import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { AiSignalsView } from "@/features/ai-signals";

export default function AiSignalsPage() {
  return (
    <DashboardShell>
      <AiSignalsView />
    </DashboardShell>
  );
}
