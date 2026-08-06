import { requireAuth } from '@/features/auth/session';
import { getCurrentUser } from '@/features/auth/get-current-user';
import { getMarketsTickerAction } from '@/features/markets/actions/get-markets';
import { UserProvider } from '@/shared/providers/user-provider';
import { SidebarProvider } from '@/shared/providers/sidebar-provider';
import { AppSidebar } from '@/shared/layouts/app-sidebar';
import { AppHeader } from '@/shared/layouts/app-header';
import { MobileBottomNav } from '@/shared/layouts/mobile-bottom-nav';
import { HomeBottomTicker } from '@/features/dashboard';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAuth();
  const [user, tickerResult] = await Promise.all([
    getCurrentUser(),
    getMarketsTickerAction(),
  ]);

  return (
    <UserProvider user={user}>
      <SidebarProvider>
        <div className="bg-background flex h-svh max-h-svh w-full max-w-full overflow-hidden">
          <AppSidebar />

          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <AppHeader />

            <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-3 pb-24 sm:p-4 lg:p-6 lg:pb-6">
              <div className="mx-auto w-full max-w-350 min-w-0">{children}</div>
            </main>

            <HomeBottomTicker
              items={tickerResult.ok ? tickerResult.data : []}
            />

            <MobileBottomNav />
          </div>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
