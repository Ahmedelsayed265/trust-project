'use client';

import { Link } from '@/i18n/navigation';
import type { LucideIcon } from 'lucide-react';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useTransition } from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { logoutAction } from '@/features/auth/actions/logout';

export type SettingsItem = {
  label: string;
  description?: string;
  href?: string;
  icon: LucideIcon;
  badge?: string;
  badgeTone?: 'success' | 'primary' | 'muted';
  danger?: boolean;
  action?: 'logout';
};

export function SettingsLink({ item }: { item: SettingsItem }) {
  const Icon = item.icon;
  const [pending, startTransition] = useTransition();

  const content = (
    <>
      <div
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-xl',
          item.danger
            ? 'bg-destructive/10 text-destructive'
            : 'bg-muted text-foreground',
        )}
      >
        {pending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Icon className="size-4" />
        )}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex flex-wrap items-center gap-2">
          <p
            className={cn(
              'text-sm font-semibold',
              item.danger ? 'text-destructive' : 'text-foreground',
            )}
          >
            {item.label}
          </p>
          {item.badge && (
            <Badge
              className={cn(
                'border-0 text-[10px]',
                item.badgeTone === 'success' &&
                  'text-success bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40',
                item.badgeTone === 'primary' &&
                  'bg-primary text-primary-foreground',
                item.badgeTone === 'muted' &&
                  'bg-muted text-muted-foreground hover:bg-muted',
              )}
            >
              {item.badge}
            </Badge>
          )}
        </div>
        {item.description && (
          <p className="text-muted-foreground truncate text-xs">
            {item.description}
          </p>
        )}
      </div>
      <ChevronRight className="text-muted-foreground size-4 shrink-0" />
    </>
  );

  const className = cn(
    'flex w-full items-center gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-muted/60 disabled:opacity-60',
  );

  if (item.action === 'logout') {
    return (
      <button
        type="button"
        className={className}
        disabled={pending}
        onClick={() => startTransition(() => logoutAction())}
      >
        {content}
      </button>
    );
  }

  if (item.href) {
    return (
      <Link href={item.href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={className}>
      {content}
    </button>
  );
}
