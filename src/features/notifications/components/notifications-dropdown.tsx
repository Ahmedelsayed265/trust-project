"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationItem } from "@/features/notifications/components/notification-item";
import {
  notifications,
  unreadNotificationCount,
} from "@/features/notifications/data/notifications";
import { routes } from "@/shared/lib/routes";
import { cn } from "@/lib/utils";

const previewNotifications = notifications.slice(0, 4);

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label="Notifications"
        className={cn(
          buttonVariants({ variant: "ghost", size: "icon" }),
          "relative shrink-0 text-muted-foreground"
        )}
      >
        <Bell className="size-5" />
        {unreadNotificationCount > 0 && (
          <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold leading-none text-white">
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
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          {unreadNotificationCount > 0 && (
            <span className="text-xs font-medium text-primary">
              {unreadNotificationCount} new
            </span>
          )}
        </div>
        <DropdownMenuSeparator className="my-0" />
        <DropdownMenuGroup className="max-h-80 overflow-y-auto scrollbar-none">
          {previewNotifications.map((notification, index) => (
            <div
              key={notification.id}
              className={cn(
                index < previewNotifications.length - 1 &&
                  "border-b border-border/70"
              )}
            >
              <NotificationItem notification={notification} compact />
            </div>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-0" />
        <div className="px-2 py-2">
          <Link
            href={routes.notifications}
            className="flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-muted"
          >
            View all notifications
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
