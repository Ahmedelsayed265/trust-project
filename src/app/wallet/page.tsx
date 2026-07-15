import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { WalletView } from "@/features/wallet";

export default function WalletPage() {
  return (
    <DashboardShell>
      <WalletView />
    </DashboardShell>
  );
}
