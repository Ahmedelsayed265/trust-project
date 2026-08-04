import {
  Home,
  LineChart,
  ArrowLeftRight,
  ClipboardList,
  Briefcase,
  Link2,
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

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  action?: "logout";
};

export const primaryNav: NavItem[] = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Markets", icon: LineChart, href: "/markets" },
  { label: "Trade", icon: ArrowLeftRight, href: "/trades" },
  { label: "Orders", icon: ClipboardList, href: "/orders" },
  { label: "Portfolio", icon: Briefcase, href: "/portfolio" },
  { label: "Accounts", icon: Link2, href: "/accounts" },
  { label: "AI Signals", icon: Sparkles, href: "/ai-signals" },
];

export const secondaryNav: NavItem[] = [
  { label: "Watchlist", icon: Star, href: "/watchlist" },
  { label: "News", icon: Newspaper, href: "/news" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar" },
];

export const systemNav: NavItem[] = [
  { label: "Profile", icon: UserRound, href: "/profile" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Help Center", icon: HelpCircle, href: "/help" },
  { label: "Log Out", icon: LogOut, href: "/login", action: "logout" },
];

export function isNavActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "#") return false;
  return pathname.startsWith(href);
}
