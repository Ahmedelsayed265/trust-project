import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { NewsView } from "@/features/news";

export default function NewsPage() {
  return (
    <DashboardShell>
      <NewsView />
    </DashboardShell>
  );
}
