"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import {
  isNavActive,
  primaryNav,
  secondaryNav,
  systemNav,
  type NavItem,
} from "@/shared/lib/navigation";
import { Logo } from "@/shared/components/logo";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { useSidebar } from "@/shared/providers/sidebar-provider";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function NavLink({
  item,
  collapsed,
  onNavigate,
}: {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = isNavActive(pathname, item.href);
  const Icon = item.icon;

  const className = cn(
    "flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-medium transition-colors",
    collapsed && "justify-center px-2",
    active
      ? "bg-sidebar-accent text-sidebar-accent-foreground"
      : "text-sidebar-foreground hover:bg-muted hover:text-foreground"
  );

  const link = (
    <Link href={item.href} onClick={onNavigate} className={className}>
      <Icon className="size-4 shrink-0" />
      {!collapsed && <span className="truncate">{item.label}</span>}
      {collapsed && <span className="sr-only">{item.label}</span>}
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
        <span className="sr-only">{item.label}</span>
      </TooltipTrigger>
      <TooltipContent side="right">{item.label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarContent({
  collapsed,
  onNavigate,
  showCollapseControl,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
  showCollapseControl?: boolean;
}) {
  const { toggleCollapsed } = useSidebar();

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div
        className={cn(
          "flex items-center border-b border-sidebar-border",
          collapsed
            ? "justify-center px-2 py-4 h-[64px]"
            : "justify-between gap-2 px-3 py-4"
        )}
      >
        <Logo iconOnly={collapsed} />
        {showCollapseControl && !collapsed && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapsed}
            aria-label="Collapse sidebar"
            className="shrink-0 text-muted-foreground"
          >
            <PanelLeftClose />
          </Button>
        )}
      </div>

      {showCollapseControl && collapsed && (
        <div className="flex justify-center border-b border-sidebar-border py-2">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleCollapsed}
            aria-label="Expand sidebar"
            className="text-muted-foreground"
          >
            <PanelLeftOpen />
          </Button>
        </div>
      )}

      <nav className="scrollbar-thin flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto px-2.5 py-3">
        <div className="space-y-0.5">
          {primaryNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-0.5">
          {secondaryNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <Separator className="my-2" />

        <div className="space-y-0.5">
          {systemNav.map((item) => (
            <NavLink
              key={item.label}
              item={item}
              collapsed={collapsed}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </nav>

      <div className="border-t border-sidebar-border p-2.5">
        <ThemeToggle collapsed={collapsed} />
      </div>
    </div>
  );
}

export function AppSidebar() {
  const { collapsed, mobileOpen, setMobileOpen } = useSidebar();

  return (
    <>
      <aside
        className={cn(
          "hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 lg:flex",
          collapsed ? "w-[72px]" : "w-[220px]"
        )}
      >
        <SidebarContent collapsed={collapsed} showCollapseControl />
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] gap-0 border-sidebar-border bg-sidebar p-0"
          showCloseButton={false}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation</SheetTitle>
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
