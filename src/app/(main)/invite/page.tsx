import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { InviteFriendsView } from "@/features/invite";

export default function InviteFriendsPage() {
  return (
    <DashboardShell>
      <InviteFriendsView />
    </DashboardShell>
  );
}
