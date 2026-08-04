import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { SettingsView } from "@/features/settings";

export default function SettingsPage() {
  return (
    <DashboardShell>
      <SettingsView />
    </DashboardShell>
  );
}
