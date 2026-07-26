import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { AccountsView } from "@/features/accounts";

export default function AccountsPage() {
  return (
    <DashboardShell>
      <AccountsView />
    </DashboardShell>
  );
}
