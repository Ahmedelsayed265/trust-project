"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  ClipboardList,
  Home,
  LineChart,
  UserRound,
} from "lucide-react";
import { routes } from "@/shared/lib/routes";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/shared/providers/sidebar-provider";

const items = [
  { label: "Home", href: routes.home, icon: Home },
  { label: "Markets", href: routes.markets, icon: LineChart },
  { label: "Trade", href: routes.trades, icon: ArrowLeftRight },
  { label: "Orders", href: routes.orders, icon: ClipboardList },
  { label: "Profile", href: routes.profile, icon: UserRound },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { setMobileOpen } = useSidebar();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 px-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 backdrop-blur lg:hidden">
      <ul className="mx-auto flex max-w-lg items-stretch justify-between gap-0">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === routes.home
              ? pathname === routes.home
              : pathname.startsWith(item.href);

          return (
            <li key={item.label} className="min-w-0 flex-1">
              <Link
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex w-full flex-col items-center gap-0.5 rounded-xl px-0.5 py-2 text-[10px] font-medium transition-colors",
                  active
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-5 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
