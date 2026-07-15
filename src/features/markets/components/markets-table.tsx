"use client";

import { useMemo, useState } from "react";
import {
  ChevronDown,
  Filter,
  MoreVertical,
  RefreshCw,
  Star,
} from "lucide-react";
import { Sparkline } from "@/shared/components/sparkline";
import { cn } from "@/lib/utils";

type Asset = {
  symbol: string;
  name: string;
  category: string;
  region: string;
  price: string;
  changePct: string;
  changeAbs: string;
  positive: boolean;
  marketCap: string;
  starred?: boolean;
  data: number[];
  iconBg: string;
  iconLabel: string;
};

const assets: Asset[] = [
  {
    symbol: "BTC/USDT",
    name: "Bitcoin",
    category: "Crypto",
    region: "All",
    price: "$67,432.10",
    changePct: "+2.45%",
    changeAbs: "+$1,612.45",
    positive: true,
    marketCap: "$1.33T",
    data: [40, 42, 38, 45, 48, 52, 50, 55, 58, 62, 65],
    iconBg: "bg-orange-100 text-orange-600",
    iconLabel: "₿",
  },
  {
    symbol: "ETH/USDT",
    name: "Ethereum",
    category: "Crypto",
    region: "All",
    price: "$3,456.78",
    changePct: "+1.82%",
    changeAbs: "+$61.85",
    positive: true,
    marketCap: "$415.2B",
    data: [35, 38, 36, 40, 42, 45, 43, 48, 50, 52, 55],
    iconBg: "bg-indigo-100 text-indigo-600",
    iconLabel: "Ξ",
  },
  {
    symbol: "SOL/USDT",
    name: "Solana",
    category: "Crypto",
    region: "All",
    price: "$175.32",
    changePct: "+8.63%",
    changeAbs: "+$13.94",
    positive: true,
    marketCap: "$78.5B",
    data: [28, 30, 35, 32, 40, 45, 48, 52, 58, 62, 70],
    iconBg: "bg-violet-100 text-violet-700",
    iconLabel: "S",
  },
  {
    symbol: "XAU/USD",
    name: "Gold",
    category: "Metals",
    region: "All",
    price: "$2,345.80",
    changePct: "+0.68%",
    changeAbs: "+$15.85",
    positive: true,
    marketCap: "—",
    data: [45, 44, 46, 45, 47, 48, 47, 49, 50, 51, 52],
    iconBg: "bg-yellow-100 text-yellow-700",
    iconLabel: "Au",
  },
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    category: "Stocks",
    region: "US",
    price: "$178.25",
    changePct: "+1.30%",
    changeAbs: "+$2.29",
    positive: true,
    marketCap: "$2.78T",
    starred: true,
    data: [40, 42, 41, 44, 43, 46, 48, 47, 50, 52, 54],
    iconBg: "bg-slate-100 text-slate-800",
    iconLabel: "",
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    category: "Stocks",
    region: "US",
    price: "$248.50",
    changePct: "-1.28%",
    changeAbs: "-$3.22",
    positive: false,
    marketCap: "$790.1B",
    data: [60, 58, 55, 56, 52, 50, 48, 45, 44, 42, 40],
    iconBg: "bg-red-100 text-red-600",
    iconLabel: "T",
  },
  {
    symbol: "2222.SR",
    name: "Saudi Aramco",
    category: "Stocks",
    region: "MENA",
    price: "SAR 28.45",
    changePct: "+0.85%",
    changeAbs: "+SAR 0.24",
    positive: true,
    marketCap: "$1.98T",
    data: [42, 43, 42, 44, 45, 44, 46, 47, 46, 48, 49],
    iconBg: "bg-emerald-100 text-emerald-700",
    iconLabel: "A",
  },
  {
    symbol: "9988.HK",
    name: "Alibaba",
    category: "Stocks",
    region: "Asia",
    price: "HK$78.20",
    changePct: "-0.95%",
    changeAbs: "-HK$0.75",
    positive: false,
    marketCap: "$186.4B",
    data: [55, 52, 53, 50, 48, 49, 46, 44, 43, 41, 40],
    iconBg: "bg-orange-100 text-orange-700",
    iconLabel: "阿",
  },
];

function AssetIcon({ asset }: { asset: Asset }) {
  if (asset.symbol === "AAPL") {
    return (
      <div
        className={`flex size-9 shrink-0 items-center justify-center rounded-full ${asset.iconBg}`}
      >
        <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden>
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      </div>
    );
  }

  return (
    <div
      className={`flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${asset.iconBg}`}
    >
      {asset.iconLabel}
    </div>
  );
}

export function MarketsTable({ category = "All" }: { category?: string }) {
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(assets.map((a) => [a.symbol, !!a.starred]))
  );
  const [watchlistOnly, setWatchlistOnly] = useState(false);

  const filtered = useMemo(() => {
    return assets.filter((asset) => {
      if (watchlistOnly && !starred[asset.symbol]) return false;
      if (category === "All") return true;
      if (["Crypto", "Stocks", "Metals"].includes(category)) {
        return asset.category === category;
      }
      return asset.region === category;
    });
  }, [category, starred, watchlistOnly]);

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            <Filter className="size-4 text-muted-foreground" />
            Filters
          </button>
          <button
            type="button"
            onClick={() => setWatchlistOnly((v) => !v)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors",
              watchlistOnly
                ? "border-primary/30 bg-accent text-primary"
                : "border-border bg-card text-foreground hover:bg-muted"
            )}
          >
            <Star
              className="size-4"
              fill={watchlistOnly ? "currentColor" : "none"}
            />
            Watchlist
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
          >
            USD
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground"
          >
            24h Change
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="w-full min-w-0 overflow-hidden rounded-lg border border-border bg-card">
        <div className="scrollbar-thin w-full max-w-full overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[720px] text-left md:min-w-[860px]">
            <thead>
              <tr className="border-b border-border text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">24h Change</th>
                <th className="px-4 py-3 font-medium">Market Cap</th>
                <th className="px-4 py-3 font-medium">Chart</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((asset) => (
                <tr
                  key={asset.symbol}
                  className="border-b border-border/70 last:border-0 transition-colors hover:bg-muted/40"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <AssetIcon asset={asset} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold text-foreground">
                            {asset.symbol}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setStarred((prev) => ({
                                ...prev,
                                [asset.symbol]: !prev[asset.symbol],
                              }))
                            }
                            className={cn(
                              "transition-colors",
                              starred[asset.symbol]
                                ? "text-primary"
                                : "text-muted-foreground/50 hover:text-primary"
                            )}
                            aria-label="Toggle watchlist"
                          >
                            <Star
                              className="size-3.5"
                              fill={
                                starred[asset.symbol] ? "currentColor" : "none"
                              }
                            />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-muted-foreground">
                            {asset.name}
                          </span>
                          <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                            {asset.category === "Metals"
                              ? "Metal"
                              : asset.category === "Stocks"
                                ? "Stock"
                                : asset.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-foreground">
                    {asset.price}
                  </td>
                  <td className="px-4 py-3.5">
                    <p
                      className={cn(
                        "text-sm font-semibold",
                        asset.positive ? "text-success" : "text-destructive"
                      )}
                    >
                      {asset.changePct}
                    </p>
                    <p
                      className={cn(
                        "text-xs",
                        asset.positive ? "text-success/80" : "text-destructive/80"
                      )}
                    >
                      {asset.changeAbs}
                    </p>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-foreground">
                    {asset.marketCap}
                  </td>
                  <td className="px-4 py-3.5">
                    <Sparkline
                      data={asset.data}
                      positive={asset.positive}
                      className="h-8 w-24"
                      strokeWidth={1.75}
                    />
                  </td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label="More actions"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <RefreshCw className="size-3.5" />
        Last updated: 30s ago
      </div>
    </div>
  );
}
