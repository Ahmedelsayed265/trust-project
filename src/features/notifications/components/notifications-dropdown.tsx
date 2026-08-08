'use client';

import type { Notification } from '@/features/notifications/types';
import { useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { Bell } from 'lucide-react';
import { toast } from 'sonner';
import { buttonVariants } from '@/components/ui/button';
import { NotificationItem } from '@/features/notifications/components/notification-item';
import { useCurrentUser } from '@/shared/providers/user-provider';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getNotificationsAction,
  markAllNotificationsReadAction,
} from '@/features/notifications/actions/notifications';
import { Link } from '@/i18n/navigation';

export function NotificationsDropdown() {
  const t = useTranslations('Notifications');
  const tCommon = useTranslations('Common');
  const tNav = useTranslations('Nav');
  const user = useCurrentUser();
  const [items, setItems] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(user.unread_notifications);
  const [loaded, setLoaded] = useState(false);
  const [loading, startLoad] = useTransition();
  const [markingAll, startMarkAll] = useTransition();

  function loadNotifications() {
    startLoad(async () => {
      const result = await getNotificationsAction({ page: 1, per_page: 20 });
      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems(result.data.items);
      setUnreadCount(result.data.unread_count);
      setLoaded(true);
    });
  }

  useEffect(() => {
    loadNotifications();
  }, []);

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

      setItems((prev) =>
        prev.map((item) => ({
          ...item,
          read: true,
          read_at: item.read_at ?? new Date().toISOString(),
        })),
      );
      setUnreadCount(result.data.unread_count);
    });
  }

  const preview = items.slice(0, 4);

  return (
    <DropdownMenu
      onOpenChange={(open) => {
        if (open) loadNotifications();
      }}
    >
      <DropdownMenuTrigger
        aria-label={tNav('notificationsAria')}
        className={cn(
          buttonVariants({ variant: 'ghost', size: 'icon' }),
          'text-muted-foreground relative shrink-0',
        )}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="bg-destructive absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full text-[10px] leading-none font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[min(100vw-1.5rem,360px)] min-w-75 overflow-hidden p-0"
      >
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <p className="text-foreground text-sm font-semibold">{t('title')}</p>
          {unreadCount > 0 ? (
            <button
              type="button"
              onClick={onMarkAllRead}
              disabled={markingAll}
              className="text-primary text-xs font-medium hover:underline disabled:opacity-60"
            >
              {markingAll ? t('marking') : t('markAllRead')}
            </button>
          ) : (
            <span className="text-muted-foreground text-xs">
              {t('allCaughtUp')}
            </span>
          )}
        </div>

        <DropdownMenuSeparator className="my-0" />

        <DropdownMenuGroup className="max-h-80 scrollbar-none overflow-y-auto">
          {loading && !loaded ? (
            <p className="text-muted-foreground px-4 py-8 text-center text-sm">
              {tCommon('loading')}
            </p>
          ) : preview.length === 0 ? (
            <p className="text-muted-foreground px-4 py-8 text-center text-sm">
              {t('emptyDropdown')}
            </p>
          ) : (
            preview.map((notification, index) => (
              <div
                key={notification.id}
                className={cn(
                  index < preview.length - 1 && 'border-border/70 border-b',
                )}
              >
                <NotificationItem
                  notification={notification}
                  compact
                  onRead={onRead}
                />
              </div>
            ))
          )}
        </DropdownMenuGroup>

        <DropdownMenuSeparator className="my-0" />
        <div className="px-2 py-2">
          <Link
            href="/notifications"
            className="text-primary hover:bg-muted flex w-full items-center justify-center rounded-md px-3 py-2.5 text-sm font-semibold transition-colors"
          >
            {t('viewAll')}
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
