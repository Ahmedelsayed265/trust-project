'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/page-header';
import { NotificationItem } from '@/features/notifications/components/notification-item';
import {
  deleteNotificationAction,
  getNotificationsAction,
  markAllNotificationsReadAction,
} from '@/features/notifications/actions/notifications';
import type {
  Notification,
  NotificationType,
  NotificationsListData,
} from '@/features/notifications/types';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'unread' | NotificationType;

const TYPE_FILTERS: { id: NotificationType; label: string }[] = [
  { id: 'trade', label: 'Trade' },
  { id: 'signal', label: 'Signal' },
  { id: 'account', label: 'Account' },
  { id: 'system', label: 'System' },
];

function queryForFilter(filter: Filter) {
  if (filter === 'all') return { per_page: 20 as const };
  if (filter === 'unread')
    return { unread: true as const, per_page: 20 as const };
  return { type: filter, per_page: 20 as const };
}

export function NotificationsView({
  initialData,
}: {
  initialData: NotificationsListData;
}) {
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState(initialData.items);
  const [unreadCount, setUnreadCount] = useState(initialData.unread_count);
  const [counts, setCounts] = useState(initialData.counts);
  const [loading, startLoad] = useTransition();
  const [markingAll, startMarkAll] = useTransition();
  const [deleting, startDelete] = useTransition();

  useEffect(() => {
    startLoad(async () => {
      const result = await getNotificationsAction(queryForFilter(filter));
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems(result.data.items);
      setUnreadCount(result.data.unread_count);
      setCounts(result.data.counts);
    });
  }, [filter]);

  function onRead(notification: Notification) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === notification.id);
      if (existing && !existing.read) {
        setUnreadCount((count) => Math.max(0, count - 1));
      }

      return prev.map((item) =>
        item.id === notification.id ? { ...item, ...notification } : item,
      );
    });
  }

  function onMarkAllRead() {
    startMarkAll(async () => {
      const result = await markAllNotificationsReadAction();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      if (filter === 'unread') {
        setItems([]);
      } else {
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            read: true,
            read_at: item.read_at ?? new Date().toISOString(),
          })),
        );
      }
      setUnreadCount(result.data.unread_count);
      toast.success('All notifications marked as read.');
    });
  }

  function onDelete(id: number) {
    startDelete(async () => {
      const target = items.find((item) => item.id === id);
      const result = await deleteNotificationAction(id);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems((prev) => prev.filter((item) => item.id !== id));
      if (target) {
        if (!target.read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        setCounts((prev) => ({
          ...prev,
          [target.type]: Math.max(0, (prev[target.type] ?? 0) - 1),
        }));
      }
    });
  }

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'unread', label: `Unread (${unreadCount})` },
    ...TYPE_FILTERS.map((tab) => ({
      id: tab.id as Filter,
      label: `${tab.label} (${counts[tab.id] ?? 0})`,
    })),
  ];

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
              disabled={markingAll || deleting || loading}
              onClick={onMarkAllRead}
            >
              {markingAll ? 'Marking...' : 'Mark all as read'}
            </Button>
          ) : null
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
              filter === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={cn('grid gap-3', loading && 'opacity-70')}>
        {items.length === 0 ? (
          <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
            <p className="text-foreground text-sm font-medium">
              You&apos;re all caught up
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              No notifications in this view.
            </p>
          </div>
        ) : (
          items.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
