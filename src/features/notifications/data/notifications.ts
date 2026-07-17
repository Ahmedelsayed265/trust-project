import { routes } from "@/shared/lib/routes";

export type NotificationType = "trade" | "signal" | "wallet" | "system";

export type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: NotificationType;
  href?: string;
};

export const notifications: Notification[] = [
  {
    id: "1",
    title: "AI signal triggered",
    description: "BTC/USDT long signal hit 82% confidence. Review entry levels.",
    time: "2 min ago",
    read: false,
    type: "signal",
    href: routes.aiSignals,
  },
  {
    id: "2",
    title: "Order filled",
    description: "Your ETH buy order for 0.85 ETH filled at $3,412.20.",
    time: "18 min ago",
    read: false,
    type: "trade",
    href: routes.orders,
  },
  {
    id: "3",
    title: "Deposit confirmed",
    description: "$2,500.00 USDT has been credited to your wallet.",
    time: "1h ago",
    read: false,
    type: "wallet",
    href: routes.wallet,
  },
  {
    id: "4",
    title: "Portfolio alert",
    description: "AAPL is up 3.2% today and nearing your watchlist target.",
    time: "3h ago",
    read: true,
    type: "system",
    href: routes.watchlist,
  },
  {
    id: "5",
    title: "Trade executed",
    description: "Sold 12 shares of NVDA at $875.40. Realized P&L +$214.80.",
    time: "Yesterday",
    read: true,
    type: "trade",
    href: routes.trades,
  },
  {
    id: "6",
    title: "Weekly AI digest",
    description: "5 strong signals and 2 moderate setups for the week ahead.",
    time: "2d ago",
    read: true,
    type: "signal",
    href: routes.aiSignals,
  },
];

export const unreadNotificationCount = notifications.filter((n) => !n.read)
  .length;
