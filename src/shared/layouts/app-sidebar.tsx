'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { Logo } from '@/shared/components/logo';
import { ThemeToggle } from '@/shared/components/theme-toggle';
import { LogoutButton } from '@/features/auth/components/logout-button';
import { useSidebar } from '@/shared/providers/sidebar-provider';
import { cn } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';
import {
  isNavActive,
  primaryNav,
  secondaryNav,
  systemNav,
  type NavItem,
} from '@/shared/lib/navigation';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

function NavLink({
  item,
  label,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  label: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const Icon = item.icon;

  if (item.action === 'logout') {
    const button = (
      <LogoutButton
        collapsed={collapsed}
        icon={Icon}
        label={label}
        onComplete={onNavigate}
      />
    );

    if (!collapsed) return button;

    return (
      <Tooltip>
        <TooltipTrigger render={<div className="w-full" />}>
          {button}
        </TooltipTrigger>
        <TooltipContent side="right">{label}</TooltipContent>
      </Tooltip>
    );
  }

  const className = cn(
    'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors',
    collapsed && 'justify-center px-2',
    active
      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
      : 'text-sidebar-foreground hover:bg-muted hover:text-foreground',
  );

  const link = (
    <Link href={item.href} onClick={onNavigate} className={className}>
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {collapsed && <span className="sr-only">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Link href={item.href} onClick={onNavigate} className={className} />
        }
      >
        <Icon className="size-4 shrink-0" />
        <span className="sr-only">{label}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  showCollapseControl?: boolean;
}) {
  const t = useTranslations('Nav');

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className={cn(
          'border-sidebar-border flex h-16 items-center border-b',
          collapsed
            ? 'justify-center px-2 py-4'
            : 'justify-between gap-2 px-3 py-4',
        )}
      >
        <Logo iconOnly={collapsed} />
      </div>

      <nav className="flex min-h-0 flex-1 scrollbar-none flex-col overflow-x-hidden overflow-y-auto px-2.5 py-3">
        <div className="space-y-0.5">
          {primaryNav.map((item) => (
            <NavLink
              key={item.labelKey}
              item={item}
              label={t(item.labelKey)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-0.5">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.labelKey}
              item={item}
              label={t(item.labelKey)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-0.5">
          {systemNav.map((item) => (
            <NavLink
              key={item.labelKey}
              item={item}
              label={t(item.labelKey)}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="border-sidebar-border flex items-center justify-center border-t p-2.5">
        <ThemeToggle collapsed={collapsed} />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const t = useTranslations('Nav');
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      <aside
        className={cn(
          'border-sidebar-border bg-sidebar hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r transition-[width] duration-200 lg:flex',
          collapsed ? 'w-18' : 'w-55',
        )}
      >
        <SidebarContent collapsed={collapsed} showCollapseControl />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="border-sidebar-border bg-sidebar w-70 gap-0 p-0"
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>{t('navigation')}</SheetTitle>
          </SheetHeader>
          <SidebarContent
            collapsed={false}
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
