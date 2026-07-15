import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { PortfolioView } from "@/features/portfolio";

export default function PortfolioPage() {
  return (
    <DashboardShell>
      <PortfolioView />
    </DashboardShell>
  );
}
