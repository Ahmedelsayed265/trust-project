import { requireAuth } from "@/features/auth/session";
import { getCurrentUser } from "@/features/auth/get-current-user";
import { MainChrome } from "./main-chrome";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const user = await getCurrentUser();

  return <MainChrome user={user}>{children}</MainChrome>;
}
