"use client";

import { AppSidebar } from "@/shared/layouts/app-sidebar";
import { AppHeader } from "@/shared/layouts/app-header";
import { MobileBottomNav } from "@/shared/layouts/mobile-bottom-nav";
import { SidebarProvider } from "@/shared/providers/sidebar-provider";

export function DashboardShell({
  children,
  footer,
}: {
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-svh max-h-svh w-full max-w-full overflow-hidden bg-background">
        <AppSidebar />
        <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
          <AppHeader />
          <main className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain p-3 pb-24 sm:p-4 lg:p-6 lg:pb-6">
            <div className="mx-auto w-full min-w-0 max-w-[1400px]">
              {children}
            </div>
          </main>
          {footer}
          <MobileBottomNav />
        </div>
      </div>
    </SidebarProvider>
  );
}
