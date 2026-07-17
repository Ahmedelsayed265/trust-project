"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/shared/components/page-header";
import { NotificationItem } from "@/features/notifications/components/notification-item";
import {
  notifications as initialNotifications,
} from "@/features/notifications/data/notifications";
import { cn } from "@/lib/utils";

type Filter = "all" | "unread";

export function NotificationsView() {
  const [filter, setFilter] = useState<Filter>("all");
  const [items, setItems] = useState(initialNotifications);

  const unreadCount = items.filter((n) => !n.read).length;
  const visible =
    filter === "unread" ? items.filter((n) => !n.read) : items;

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Notifications"
        description="Trade alerts, AI signals, and account updates."
        actions={
          unreadCount > 0 ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() =>
                setItems((prev) => prev.map((n) => ({ ...n, read: true })))
              }
            >
              Mark all as read
            </Button>
          ) : null
        }
      />

      <div className="flex items-center gap-2">
        {(
          [
            { id: "all", label: "All" },
            { id: "unread", label: `Unread (${unreadCount})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              filter === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid gap-3">
        {visible.length === 0 ? (
          <div className="rounded-lg border border-border bg-card px-4 py-10 text-center">
            <p className="text-sm font-medium text-foreground">
              You&apos;re all caught up
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              No unread notifications right now.
            </p>
          </div>
        ) : (
          visible.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))
        )}
      </div>
    </div>
  );
}
