export type Position = {
  symbol: string;
  name: string;
  quantity: string;
  value: string;
  pnl: string;
  pnlPct: string;
  positive: boolean;
  iconBg: string;
  iconLabel: string;
};

export const openPositions: Position[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    quantity: "0.01484 BTC",
    value: "$1,000.00",
    pnl: "+$32.85",
    pnlPct: "+3.24%",
    positive: true,
    iconBg: "bg-orange-100 text-orange-600 dark:bg-orange-950/40 dark:text-orange-300",
    iconLabel: "₿",
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    quantity: "0.42 ETH",
    value: "$1,451.85",
    pnl: "+$48.20",
    pnlPct: "+3.43%",
    positive: true,
    iconBg: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300",
    iconLabel: "Ξ",
  },
  {
    symbol: "XAU/USD",
    name: "Gold",
    quantity: "0.5 oz",
    value: "$1,172.90",
    pnl: "+$12.40",
    pnlPct: "+1.07%",
    positive: true,
    iconBg: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300",
    iconLabel: "Au",
  },
];
