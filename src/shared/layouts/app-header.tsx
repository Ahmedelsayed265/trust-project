'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTransition } from 'react';
import { ChevronDown, Loader2, Menu, Search, Settings } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NotificationsDropdown } from '@/features/notifications';
import { logoutAction } from '@/features/auth/actions/logout';
import { useSidebar } from '@/shared/providers/sidebar-provider';
import { useCurrentUser } from '@/shared/providers/user-provider';
import { LocaleSwitcher } from '@/shared/components/locale-switcher';

export function AppHeader() {
  const t = useTranslations('Header');
  const tNav = useTranslations('Nav');
  const tBrand = useTranslations('Brand');
  const user = useCurrentUser();
  const { isDesktop, toggleCollapsed, toggleMobile } = useSidebar();
  const [loggingOut, startLogout] = useTransition();

  return (
    <header className="border-border bg-card flex h-14 shrink-0 items-center gap-2 border-b px-3 sm:h-16 sm:gap-4 sm:px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="text-muted-foreground shrink-0"
        onClick={() => (isDesktop ? toggleCollapsed() : toggleMobile())}
        aria-label={isDesktop ? t('toggleSidebar') : t('openMenu')}
      >
        <Menu />
      </Button>

      <div className="mx-auto flex w-full max-w-xl flex-1 items-center">
        <div className="relative w-full">
          <Search className="text-muted-foreground pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            type="search"
            placeholder={t('searchPlaceholder')}
            className="border-border bg-muted/60 h-9 rounded-xl ps-9 text-sm shadow-none sm:h-10"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <LocaleSwitcher className="bg-card hidden h-9 min-w-28 rounded-[12px]! sm:flex" />

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-muted-foreground hidden shrink-0 sm:inline-flex"
          aria-label={t('settingsAria')}
          nativeButton={false}
          render={<Link href="/settings" />}
        >
          <Settings className="size-5" />
        </Button>

        <NotificationsDropdown />

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="h-auto gap-2 rounded-xl px-1.5 py-1 sm:px-2"
              />
            }
          >
            <Avatar size="default" className="size-8 sm:size-9">
              <AvatarFallback className="bg-linear-to-br from-sky-400 to-blue-600 text-xs font-bold text-white">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 text-left leading-tight md:block">
              <p className="text-foreground truncate text-sm font-semibold">
                {user.name}
              </p>
              <p className="text-primary text-[11px] font-medium">
                {user.plan?.name ?? tBrand('planFree')}
              </p>
            </div>
            <ChevronDown className="text-muted-foreground hidden size-4 shrink-0 md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{tNav('myAccount')}</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href="/profile" />}>
                {tNav('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem render={<Link href="/settings" />}>
                {tNav('settings')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={loggingOut}
                onClick={() => startLogout(() => logoutAction())}
              >
                {loggingOut ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : null}
                {tNav('logOutAlt')}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
