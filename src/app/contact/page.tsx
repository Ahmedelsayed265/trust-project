import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { ContactView } from "@/features/contact";

export default function ContactPage() {
  return (
    <DashboardShell>
      <ContactView />
    </DashboardShell>
  );
}
