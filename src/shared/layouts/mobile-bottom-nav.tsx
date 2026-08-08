'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import {
  ArrowLeftRight,
  ClipboardList,
  Home,
  LineChart,
  UserRound,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/shared/providers/sidebar-provider';

const items = [
  { labelKey: 'home' as const, href: '/', icon: Home },
  { labelKey: 'markets' as const, href: '/markets', icon: LineChart },
  { labelKey: 'trade' as const, href: '/trades', icon: ArrowLeftRight },
  { labelKey: 'orders' as const, href: '/orders', icon: ClipboardList },
  { labelKey: 'profile' as const, href: '/profile', icon: UserRound },
];

export function MobileBottomNav() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  return (
    <nav className="border-border bg-card/95 fixed inset-x-0 bottom-0 z-40 border-t px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0">
        {items.map((item) => {
          const Icon = item.icon;
          const label = t(item.labelKey);
          const active =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

          return (
            <li key={item.labelKey} className="min-w-0 flex-1">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  'flex w-full flex-col items-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-medium transition-colors',
                  active
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
