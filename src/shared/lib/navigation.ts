import {
  Home,
  LineChart,
  ArrowLeftRight,
  ClipboardList,
  Briefcase,
  Wallet,
  Sparkles,
  Star,
  Newspaper,
  CalendarDays,
  UserRound,
  Settings,
  HelpCircle,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import { routes } from "@/shared/lib/routes";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const primaryNav: NavItem[] = [
  { label: "Home", icon: Home, href: routes.home },
  { label: "Markets", icon: LineChart, href: routes.markets },
  { label: "Trade", icon: ArrowLeftRight, href: routes.trades },
  { label: "Orders", icon: ClipboardList, href: routes.orders },
  { label: "Portfolio", icon: Briefcase, href: routes.portfolio },
  { label: "Wallet", icon: Wallet, href: routes.wallet },
  { label: "AI Signals", icon: Sparkles, href: routes.aiSignals },
];

export const secondaryNav: NavItem[] = [
  { label: "Watchlist", icon: Star, href: routes.watchlist },
  { label: "News", icon: Newspaper, href: routes.news },
  { label: "Calendar", icon: CalendarDays, href: routes.calendar },
];

export const systemNav: NavItem[] = [
  { label: "Profile", icon: UserRound, href: routes.profile },
  { label: "Settings", icon: Settings, href: routes.settings },
  { label: "Help Center", icon: HelpCircle, href: routes.help },
  { label: "Log Out", icon: LogOut, href: routes.login },
];

export function isNavActive(pathname: string, href: string) {
  if (href === routes.home) return pathname === routes.home;
  if (href === "#") return false;
  return pathname.startsWith(href);
}
