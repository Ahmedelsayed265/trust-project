export type OrderSide = "buy" | "sell";
export type OrderStatus = "pending" | "partially_filled" | "filled" | "cancelled";
export type OrderType = "limit" | "market";

export type Order = {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  status: OrderStatus;
  orderType: OrderType;
  amount: string;
  filled?: string;
  price: string;
  total: string;
  totalLabel?: string;
  iconBg: string;
  iconLabel: string;
  createdAt?: string;
};

export type Fill = {
  id: string;
  symbol: string;
  name: string;
  side: OrderSide;
  amount: string;
  price: string;
  status: "filled";
  time: string;
  iconBg: string;
  iconLabel: string;
};

export const openOrdersSeed: Order[] = [
  {
    id: "ord-1",
    symbol: "BTC/USDT",
    name: "Bitcoin",
    side: "buy",
    status: "pending",
    orderType: "limit",
    amount: "0.05 BTC",
    price: "$66,500.00",
    total: "$3,325.00",
    totalLabel: "Est. Total",
    iconBg:
      "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300",
    iconLabel: "₿",
  },
  {
    id: "ord-2",
    symbol: "ETH/USDT",
    name: "Ethereum",
    side: "sell",
    status: "partially_filled",
    orderType: "market",
    amount: "2.5 ETH",
    filled: "1.2 / 2.5 ETH",
    price: "$3,440.50",
    total: "$8,601.25",
    totalLabel: "Total",
    iconBg:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300",
    iconLabel: "Ξ",
  },
  {
    id: "ord-3",
    symbol: "XAU/USD",
    name: "Gold",
    side: "buy",
    status: "pending",
    orderType: "limit",
    amount: "2.0 oz",
    price: "$2,340.00",
    total: "$4,680.00",
    totalLabel: "Est. Total",
    iconBg:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
    iconLabel: "Au",
  },
  {
    id: "ord-4",
    symbol: "AAPL",
    name: "Apple Inc.",
    side: "sell",
    status: "pending",
    orderType: "limit",
    amount: "15 shares",
    price: "$180.00",
    total: "$2,700.00",
    totalLabel: "Est. Total",
    iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    iconLabel: "",
  },
];

export const orderHistorySeed: Order[] = [
  {
    id: "hist-1",
    symbol: "SOL/USDT",
    name: "Solana",
    side: "buy",
    status: "filled",
    orderType: "market",
    amount: "10 SOL",
    price: "$175.32",
    total: "$1,753.20",
    totalLabel: "Total",
    iconBg:
      "bg-violet-100 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300",
    iconLabel: "S",
    createdAt: "Today, 09:12",
  },
  {
    id: "hist-2",
    symbol: "TSLA",
    name: "Tesla Inc.",
    side: "sell",
    status: "cancelled",
    orderType: "limit",
    amount: "5 shares",
    price: "$250.00",
    total: "$1,250.00",
    totalLabel: "Est. Total",
    iconBg: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-300",
    iconLabel: "T",
    createdAt: "Yesterday, 16:40",
  },
];

export const recentFillsSeed: Fill[] = [
  {
    id: "fill-1",
    symbol: "BTC/USDT",
    name: "Bitcoin",
    side: "buy",
    amount: "0.02 BTC",
    price: "$67,200.00",
    status: "filled",
    time: "Today, 14:32",
    iconBg:
      "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300",
    iconLabel: "₿",
  },
  {
    id: "fill-2",
    symbol: "ETH/USDT",
    name: "Ethereum",
    side: "sell",
    amount: "0.8 ETH",
    price: "$3,448.10",
    status: "filled",
    time: "Today, 11:18",
    iconBg:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300",
    iconLabel: "Ξ",
  },
  {
    id: "fill-3",
    symbol: "AAPL",
    name: "Apple Inc.",
    side: "buy",
    amount: "10 shares",
    price: "$177.90",
    status: "filled",
    time: "Yesterday, 15:05",
    iconBg: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
    iconLabel: "",
  },
];

export function statusLabel(status: OrderStatus) {
  switch (status) {
    case "pending":
      return "Pending";
    case "partially_filled":
      return "Partially Filled";
    case "filled":
      return "Filled";
    case "cancelled":
      return "Cancelled";
  }
}
