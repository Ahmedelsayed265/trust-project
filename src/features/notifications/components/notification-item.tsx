import Link from "next/link";
import {
  ArrowLeftRight,
  Sparkles,
  Wallet,
  Info,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Notification, NotificationType } from "@/features/notifications/data/notifications";

const typeIcon: Record<NotificationType, LucideIcon> = {
  trade: ArrowLeftRight,
  signal: Sparkles,
  wallet: Wallet,
  system: Info,
};

const typeColor: Record<NotificationType, string> = {
  trade: "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300",
  signal:
    "bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300",
  wallet:
    "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
  system:
    "bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300",
};

export function NotificationItem({
  notification,
  compact,
}: {
  notification: Notification;
  compact?: boolean;
}) {
  const Icon = typeIcon[notification.type];
  const content = (
    <>
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-xl",
          compact ? "size-9" : "size-10",
          typeColor[notification.type]
        )}
      >
        <Icon className={compact ? "size-4" : "size-5"} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "font-semibold text-foreground",
              compact ? "text-sm" : "text-base"
            )}
          >
            {notification.title}
          </p>
          {!notification.read && (
            <span className="mt-1.5 size-2 shrink-0 rounded-full bg-primary" />
          )}
        </div>
        <p
          className={cn(
            "mt-0.5 leading-relaxed text-muted-foreground",
            compact ? "line-clamp-2 text-xs" : "text-sm"
          )}
        >
          {notification.description}
        </p>
        <p className="mt-1 text-[11px] text-muted-foreground">
          {notification.time}
        </p>
      </div>
    </>
  );

  const className = cn(
    "flex gap-3 transition-colors",
    compact
      ? "rounded-none px-4 py-3 hover:bg-muted/60"
      : "rounded-lg border border-border bg-card p-4 hover:bg-muted/20",
    !notification.read &&
      (compact
        ? "bg-primary/[0.04]"
        : "border-primary/20 bg-primary/[0.03]")
  );

  if (notification.href) {
    return (
      <Link href={notification.href} className={className}>
        {content}
      </Link>
    );
  }

  return <div className={className}>{content}</div>;
}
