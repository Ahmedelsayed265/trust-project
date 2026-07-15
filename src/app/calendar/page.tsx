import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { CalendarView } from "@/features/calendar";

export default function CalendarPage() {
  return (
    <DashboardShell>
      <CalendarView />
    </DashboardShell>
  );
}
