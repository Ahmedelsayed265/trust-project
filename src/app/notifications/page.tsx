import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { NotificationsView } from "@/features/notifications";

export default function NotificationsPage() {
  return (
    <DashboardShell>
      <NotificationsView />
    </DashboardShell>
  );
}
