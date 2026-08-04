import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { ProfileView } from "@/features/profile";

export default function ProfilePage() {
  return (
    <DashboardShell>
      <ProfileView />
    </DashboardShell>
  );
}
