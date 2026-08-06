'use client';

import Link from 'next/link';
import { Bell } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationItem } from '@/features/notifications/components/notification-item';
import {
  notifications,
  unreadNotificationCount,
} from '@/features/notifications/data/notifications';
import { cn } from '@/lib/utils';

const previewNotifications = notifications.slice(0, 4);

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'text-muted-foreground relative shrink-0',
        )}
      >
        <Bell className="size-5" />
        {unreadNotificationCount > 0 && (
          <span className="bg-destructive absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-bold text-white">
            {unreadNotificationCount}
          </span>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-1.5rem,360px)] min-w-[300px] overflow-hidden p-0"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="text-foreground text-sm font-semibold">Notifications</p>
          {unreadNotificationCount > 0 && (
            <span className="text-primary text-xs font-medium">
              {unreadNotificationCount} new
            </span>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuGroup className="max-h-80 scrollbar-none overflow-y-auto">
          {previewNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={cn(
                index < previewNotifications.length - 1 &&
                  'border-border/70 border-b',
              )}
            >
              <NotificationItem notification={notification} compact />
            </div>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-0" />
        <div className="px-2 py-2">
          <Link
            href="/notifications"
            className="text-primary hover:bg-muted flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold transition-colors"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
