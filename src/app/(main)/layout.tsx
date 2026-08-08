import { requireAuth } from '@/features/auth/session';
import { getCurrentUser } from '@/features/auth/get-current-user';
import { getSettingsAction } from '@/features/app-settings/actions/get-settings';
import { DEFAULT_APP_SETTINGS } from '@/features/app-settings/types';
import { MaintenanceBanner } from '@/features/app-settings/components/maintenance-banner';
import { getMarketsTickerAction } from '@/features/markets/actions/get-markets';
import { AppSettingsProvider } from '@/shared/providers/app-settings-provider';
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
  const [user, tickerResult, settingsResult] = await Promise.all([
    getCurrentUser(),
    getMarketsTickerAction(),
    getSettingsAction(),
  ]);

  const settings = settingsResult.ok
    ? settingsResult.data
    : DEFAULT_APP_SETTINGS;

  return (
    <UserProvider user={user}>
      <AppSettingsProvider settings={settings}>
        <SidebarProvider>
          <div className="bg-background flex h-svh max-h-svh w-full max-w-full overflow-hidden">
            <AppSidebar />

            <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
              <AppHeader />
              <MaintenanceBanner />

              <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto overscroll-contain p-5">
                <div className="mx-auto flex w-full flex-1 flex-col">
                  {children}
                </div>
              </main>

              <HomeBottomTicker
                items={tickerResult.ok ? tickerResult.data : []}
              />

              <MobileBottomNav />
            </div>
          </div>
        </SidebarProvider>
      </AppSettingsProvider>
    </UserProvider>
  );
}
