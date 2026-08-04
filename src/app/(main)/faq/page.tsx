import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { FaqView } from "@/features/faq";

export default function FaqPage() {
  return (
    <DashboardShell>
      <FaqView />
    </DashboardShell>
  );
}
