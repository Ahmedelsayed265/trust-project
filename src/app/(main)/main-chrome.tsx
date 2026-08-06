'use client';

import { usePathname } from 'next/navigation';
import { AppSidebar } from '@/shared/layouts/app-sidebar';
import { AppHeader } from '@/shared/layouts/app-header';
import { MobileBottomNav } from '@/shared/layouts/mobile-bottom-nav';
import { SidebarProvider } from '@/shared/providers/sidebar-provider';
import { UserProvider } from '@/shared/providers/user-provider';
import { BottomTicker } from '@/features/dashboard';
import type { UserProfile } from '@/features/auth/types';

export function MainChrome({
  user,
  children,
}: {
  user: UserProfile;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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

            {pathname === '/' && <BottomTicker />}

            <MobileBottomNav />
          </div>
        </div>
      </SidebarProvider>
    </UserProvider>
  );
}
