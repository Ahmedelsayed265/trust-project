import { requireAuth } from "@/features/auth/session";
import { MainChrome } from "./main-chrome";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  return <MainChrome>{children}</MainChrome>;
}
