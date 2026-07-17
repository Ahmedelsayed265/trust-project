import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { AboutView } from "@/features/about";

export default function AboutPage() {
  return (
    <DashboardShell>
      <AboutView />
    </DashboardShell>
  );
}
