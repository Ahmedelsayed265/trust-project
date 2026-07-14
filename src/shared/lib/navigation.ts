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
  { label: "Portfolio", icon: Briefcase, href: "#" },
  { label: "Wallet", icon: Wallet, href: "#" },
  { label: "AI Signals", icon: Sparkles, href: "#" },
];

export const secondaryNav: NavItem[] = [
  { label: "Watchlist", icon: Star, href: "#" },
  { label: "News", icon: Newspaper, href: "#" },
  { label: "Calendar", icon: CalendarDays, href: "#" },
];

export const systemNav: NavItem[] = [
  { label: "Profile", icon: UserRound, href: routes.profile },
  { label: "Settings", icon: Settings, href: "#" },
  { label: "Help Center", icon: HelpCircle, href: "#" },
  { label: "Log Out", icon: LogOut, href: routes.login },
];

export function isNavActive(pathname: string, href: string) {
  if (href === routes.home) return pathname === routes.home;
  if (href === "#") return false;
  return pathname.startsWith(href);
}
