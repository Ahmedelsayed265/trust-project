import { DashboardShell } from "@/shared/layouts/dashboard-shell";
import { AiChatView } from "@/features/ai-chat";

export default function AiChatPage() {
  return (
    <DashboardShell>
      <AiChatView />
    </DashboardShell>
  );
}
