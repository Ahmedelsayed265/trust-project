import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { BottomTicker, HomeDashboard } from "@/features/dashboard";

export default function HomePage() {
  return (
    <DashboardShell footer={<BottomTicker />}>
      <HomeDashboard />
    </DashboardShell>
  );
}
