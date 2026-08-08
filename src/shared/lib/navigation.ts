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
} from 'lucide-react';

export type NavItem = {
  labelKey:
    | 'home'
    | 'markets'
    | 'trade'
    | 'orders'
    | 'portfolio'
    | 'accounts'
    | 'aiSignals'
    | 'watchlist'
    | 'news'
    | 'calendar'
    | 'profile'
    | 'settings'
    | 'helpCenter'
    | 'logOut';
  href: string;
  icon: LucideIcon;
  action?: 'logout';
};

export const primaryNav: NavItem[] = [
  { labelKey: 'home', icon: Home, href: '/' },
  { labelKey: 'markets', icon: LineChart, href: '/markets' },
  { labelKey: 'trade', icon: ArrowLeftRight, href: '/trades' },
  { labelKey: 'orders', icon: ClipboardList, href: '/orders' },
  { labelKey: 'portfolio', icon: Briefcase, href: '/portfolio' },
  { labelKey: 'accounts', icon: Link2, href: '/accounts' },
  { labelKey: 'aiSignals', icon: Sparkles, href: '/ai-signals' },
];

export const secondaryNav: NavItem[] = [
  { labelKey: 'watchlist', icon: Star, href: '/watchlist' },
  { labelKey: 'news', icon: Newspaper, href: '/news' },
  { labelKey: 'calendar', icon: CalendarDays, href: '/calendar' },
];

export const systemNav: NavItem[] = [
  { labelKey: 'profile', icon: UserRound, href: '/profile' },
  { labelKey: 'settings', icon: Settings, href: '/settings' },
  { labelKey: 'helpCenter', icon: HelpCircle, href: '/help' },
  { labelKey: 'logOut', icon: LogOut, href: '/login', action: 'logout' },
];

export function isNavActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  if (href === '#') return false;
  return pathname.startsWith(href);
}
