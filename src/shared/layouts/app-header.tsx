"use client";

import Link from "next/link";
import { Bell, ChevronDown, Menu, Search, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/shared/providers/sidebar-provider";
import { routes } from "@/shared/lib/routes";
import { currentUser } from "@/shared/lib/user";

export function AppHeader() {
  const { isDesktop, toggleCollapsed, toggleMobile } = useSidebar();

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-card px-3 sm:h-16 sm:gap-4 sm:px-5">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground"
        onClick={() => (isDesktop ? toggleCollapsed() : toggleMobile())}
        aria-label={isDesktop ? "Toggle sidebar" : "Open menu"}
      >
        <Menu />
      </Button>

      <div className="mx-auto flex w-full max-w-xl flex-1 items-center">
        <div className="relative w-full">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search for assets, markets..."
            className="h-9 rounded-xl border-border bg-muted/60 pl-9 text-sm shadow-none sm:h-10"
          />
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 sm:gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="hidden shrink-0 text-muted-foreground sm:inline-flex"
          aria-label="Settings"
        >
          <Settings className="size-5" />
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative shrink-0 text-muted-foreground"
          aria-label="Notifications"
        >
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold leading-none text-white">
            3
          </span>
        </Button>

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
              <AvatarFallback className="bg-gradient-to-br from-sky-400 to-blue-600 text-xs font-bold text-white">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden min-w-0 leading-tight text-left md:block">
              <p className="truncate text-sm font-semibold text-foreground">
                {currentUser.name}
              </p>
              <p className="text-[11px] font-medium text-primary">
                {currentUser.plan}
              </p>
            </div>
            <ChevronDown className="hidden size-4 shrink-0 text-muted-foreground md:block" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuItem render={<Link href={routes.profile} />}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href={routes.login} />}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
