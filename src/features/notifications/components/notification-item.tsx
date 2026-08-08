'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTransition } from 'react';
import {
  ArrowLeftRight,
  Info,
  Link2,
  Sparkles,
  Trash2,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { markNotificationReadAction } from '@/features/notifications/actions/notifications';
import type {
  Notification,
  NotificationType,
} from '@/features/notifications/types';

const typeIcon: Record<NotificationType, LucideIcon> = {
  trade: ArrowLeftRight,
  signal: Sparkles,
  account: Link2,
  system: Info,
};

const typeColor: Record<NotificationType, string> = {
  trade: 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300',
  signal:
    'bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300',
  account:
    'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
  system: 'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300',
};

export function NotificationItem({
  notification,
  compact,
  onRead,
  onDelete,
}: {
  notification: Notification;
  compact?: boolean;
  onRead?: (notification: Notification) => void;
  onDelete?: (id: number) => void;
}) {
  const t = useTranslations('Notifications');
  const Icon = typeIcon[notification.type] ?? Info;
  const [pending, startTransition] = useTransition();

  function markRead() {
    if (notification.read) {
      onRead?.(notification);
      return;
    }

    startTransition(async () => {
      const result = await markNotificationReadAction(notification.id);
      if (result.ok) {
        onRead?.(result.data);
      }
    });
  }

  const content = (
    <>
      <div
        className={cn(
          'flex shrink-0 items-center justify-center rounded-xl',
          compact ? 'size-9' : 'size-10',
          typeColor[notification.type] ?? typeColor.system,
        )}
      >
        <Icon className={compact ? 'size-4' : 'size-5'} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              'text-foreground font-semibold',
              compact ? 'text-sm' : 'text-base',
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="bg-primary mt-1.5 size-2 shrink-0 rounded-full" />
          )}
        </div>
        <p
          className={cn(
            'text-muted-foreground mt-0.5 leading-relaxed',
            compact ? 'line-clamp-2 text-xs' : 'text-sm',
          )}
        >
          {notification.description}
        </p>
        <p className="text-muted-foreground mt-1 text-[11px]">
          {notification.time}
        </p>
      </div>
    </>
  );

  const className = cn(
    'flex w-full gap-3 transition-colors text-left',
    compact
      ? 'rounded-none px-4 py-3 hover:bg-muted/60'
      : 'rounded-lg border border-border bg-card p-4 hover:bg-muted/20',
    !compact && onDelete && 'pr-12',
    !notification.read &&
      (compact ? 'bg-primary/[0.04]' : 'border-primary/20 bg-primary/[0.03]'),
    pending && 'opacity-70',
  );

  const body = notification.href ? (
    <Link href={notification.href} className={className} onClick={markRead}>
      {content}
    </Link>
  ) : (
    <button type="button" className={className} onClick={markRead}>
      {content}
    </button>
  );

  if (!onDelete || compact) {
    return body;
  }

  return (
    <div className="relative">
      {body}
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        className="text-muted-foreground hover:text-destructive absolute top-3 right-3"
        aria-label={t('deleteAria')}
        disabled={pending}
        onClick={() => onDelete(notification.id)}
      >
        <Trash2 className="size-4" />
      </Button>
    </div>
  );
}
