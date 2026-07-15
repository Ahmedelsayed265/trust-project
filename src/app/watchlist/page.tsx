import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { WatchlistView } from "@/features/watchlist";

export default function WatchlistPage() {
  return (
    <DashboardShell>
      <WatchlistView />
    </DashboardShell>
  );
}
