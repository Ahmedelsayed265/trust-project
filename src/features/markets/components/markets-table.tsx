'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeftRight,
  ChevronDown,
  Copy,
  Filter,
  MoreVertical,
  RefreshCw,
  Sparkles,
  Star,
} from 'lucide-react';
import { Sparkline } from '@/shared/components/sparkline';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
type Currency = 'USD' | 'EUR' | 'SAR';
type ChangePeriod = '24h' | '7d' | '30d';

type Asset = {
  symbol: string;
  name: string;
  category: string;
  region: string;
  priceUsd: number;
  changePct24h: number;
  changePct7d: number;
  changePct30d: number;
  marketCapUsd: number | null;
  starred?: boolean;
  data: number[];
  iconBg: string;
  iconLabel: string;
};

const FX: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  SAR: 3.75,
};

const assets: Asset[] = [
  {
    symbol: 'BTC/USDT',
    name: 'Bitcoin',
    category: 'Crypto',
    region: 'All',
    priceUsd: 67432.1,
    changePct24h: 2.45,
    changePct7d: 5.12,
    changePct30d: 12.4,
    marketCapUsd: 1.33e12,
    data: [40, 42, 38, 45, 48, 52, 50, 55, 58, 62, 65],
    iconBg: 'bg-orange-100 text-orange-600',
    iconLabel: '₿',
  },
  {
    symbol: 'ETH/USDT',
    name: 'Ethereum',
    category: 'Crypto',
    region: 'All',
    priceUsd: 3456.78,
    changePct24h: 1.82,
    changePct7d: 3.4,
    changePct30d: 8.1,
    marketCapUsd: 415.2e9,
    data: [35, 38, 36, 40, 42, 45, 43, 48, 50, 52, 55],
    iconBg: 'bg-indigo-100 text-indigo-600',
    iconLabel: 'Ξ',
  },
  {
    symbol: 'SOL/USDT',
    name: 'Solana',
    category: 'Crypto',
    region: 'All',
    priceUsd: 175.32,
    changePct24h: 8.63,
    changePct7d: 14.2,
    changePct30d: 28.5,
    marketCapUsd: 78.5e9,
    data: [28, 30, 35, 32, 40, 45, 48, 52, 58, 62, 70],
    iconBg: 'bg-violet-100 text-violet-700',
    iconLabel: 'S',
  },
  {
    symbol: 'XAU/USD',
    name: 'Gold',
    category: 'Metals',
    region: 'All',
    priceUsd: 2345.8,
    changePct24h: 0.68,
    changePct7d: 1.2,
    changePct30d: 3.5,
    marketCapUsd: null,
    data: [45, 44, 46, 45, 47, 48, 47, 49, 50, 51, 52],
    iconBg: 'bg-yellow-100 text-yellow-700',
    iconLabel: 'Au',
  },
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    category: 'Stocks',
    region: 'US',
    priceUsd: 178.25,
    changePct24h: 1.3,
    changePct7d: 2.1,
    changePct30d: 4.8,
    marketCapUsd: 2.78e12,
    starred: true,
    data: [40, 42, 41, 44, 43, 46, 48, 47, 50, 52, 54],
    iconBg: 'bg-slate-100 text-slate-800',
    iconLabel: '',
  },
  {
    symbol: 'TSLA',
    name: 'Tesla Inc.',
    category: 'Stocks',
    region: 'US',
    priceUsd: 248.5,
    changePct24h: -1.28,
    changePct7d: -3.4,
    changePct30d: 6.2,
    marketCapUsd: 790.1e9,
    data: [60, 58, 55, 56, 52, 50, 48, 45, 44, 42, 40],
    iconBg: 'bg-red-100 text-red-600',
    iconLabel: 'T',
  },
  {
    symbol: '2222.SR',
    name: 'Saudi Aramco',
    category: 'Stocks',
    region: 'MENA',
    priceUsd: 7.58,
    changePct24h: 0.85,
    changePct7d: 1.1,
    changePct30d: 2.4,
    marketCapUsd: 1.98e12,
    data: [42, 43, 42, 44, 45, 44, 46, 47, 46, 48, 49],
    iconBg: 'bg-emerald-100 text-emerald-700',
    iconLabel: 'A',
  },
  {
    symbol: '9988.HK',
    name: 'Alibaba',
    category: 'Stocks',
    region: 'Asia',
    priceUsd: 10.02,
    changePct24h: -0.95,
    changePct7d: -2.2,
    changePct30d: 1.8,
    marketCapUsd: 186.4e9,
    data: [55, 52, 53, 50, 48, 49, 46, 44, 43, 41, 40],
    iconBg: 'bg-orange-100 text-orange-700',
    iconLabel: '阿',
  },
];

function formatPrice(usd: number, currency: Currency) {
  const value = usd * FX[currency];
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: value >= 100 ? 2 : 4,
    maximumFractionDigits: value >= 100 ? 2 : 4,
  }).format(value);
}

function formatMarketCap(usd: number | null, currency: Currency) {
  if (usd == null) return '—';
  const value = usd * FX[currency];
  if (value >= 1e12) return `${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(1)}M`;
  return value.toFixed(0);
}

function changeFor(asset: Asset, period: ChangePeriod) {
  if (period === '7d') return asset.changePct7d;
  if (period === '30d') return asset.changePct30d;
  return asset.changePct24h;
}

function formatPct(value: number) {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

function formatAbsChange(priceUsd: number, pct: number, currency: Currency) {
  const abs = (priceUsd * pct) / 100;
  const formatted = formatPrice(Math.abs(abs), currency);
  return pct >= 0 ? `+${formatted}` : `-${formatted.replace('-', '')}`;
}

function AssetIcon({ asset }: { asset: Asset }) {
  if (asset.symbol === 'AAPL') {
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

export function MarketsTable({
  category = 'All',
  search = '',
}: {
  category?: string;
  search?: string;
}) {
  const [starred, setStarred] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(assets.map((a) => [a.symbol, !!a.starred])),
  );
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [currency, setCurrency] = useState<Currency>('USD');
  const [changePeriod, setChangePeriod] = useState<ChangePeriod>('24h');
  const [gainersOnly, setGainersOnly] = useState(false);
  const [losersOnly, setLosersOnly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const rows = assets.filter((asset) => {
      if (watchlistOnly && !starred[asset.symbol]) return false;
      if (q) {
        const hay = `${asset.symbol} ${asset.name}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      const pct = changeFor(asset, changePeriod);
      if (gainersOnly && pct <= 0) return false;
      if (losersOnly && pct >= 0) return false;
      if (category === 'All') return true;
      if (['Crypto', 'Stocks', 'Metals'].includes(category)) {
        return asset.category === category;
      }
      return asset.region === category;
    });

    return [...rows].sort(
      (a, b) => changeFor(b, changePeriod) - changeFor(a, changePeriod),
    );
  }, [
    category,
    starred,
    watchlistOnly,
    search,
    changePeriod,
    gainersOnly,
    losersOnly,
  ]);

  function toggleStar(symbol: string) {
    setStarred((prev) => ({ ...prev, [symbol]: !prev[symbol] }));
  }

  async function copySymbol(symbol: string) {
    try {
      await navigator.clipboard.writeText(symbol);
      setCopied(symbol);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      // ignore clipboard failures
    }
  }

  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-auto rounded-xl px-3 py-2 text-sm font-medium"
                />
              }
            >
              <Filter className="text-muted-foreground size-4" />
              Filters
              <ChevronDown className="text-muted-foreground size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-48">
              <DropdownMenuGroup>
                <DropdownMenuLabel>Performance</DropdownMenuLabel>
                <DropdownMenuCheckboxItem
                  checked={gainersOnly}
                  onCheckedChange={(checked) => {
                    setGainersOnly(checked === true);
                    if (checked) setLosersOnly(false);
                  }}
                >
                  Gainers only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={losersOnly}
                  onCheckedChange={(checked) => {
                    setLosersOnly(checked === true);
                    if (checked) setGainersOnly(false);
                  }}
                >
                  Losers only
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={watchlistOnly}
                  onCheckedChange={(checked) =>
                    setWatchlistOnly(checked === true)
                  }
                >
                  Watchlist only
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  setGainersOnly(false);
                  setLosersOnly(false);
                  setWatchlistOnly(false);
                }}
              >
                Clear filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            type="button"
            onClick={() => setWatchlistOnly((v) => !v)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors',
              watchlistOnly
                ? 'border-primary/30 bg-accent text-primary'
                : 'border-border bg-card text-foreground hover:bg-muted',
            )}
          >
            <Star
              className="size-4"
              fill={watchlistOnly ? 'currentColor' : 'none'}
            />
            Watchlist
          </button>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-auto rounded-xl px-3 py-2 text-sm font-medium"
                />
              }
            >
              {currency}
              <ChevronDown className="text-muted-foreground size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-36">
              <DropdownMenuRadioGroup
                value={currency}
                onValueChange={(value) => setCurrency(value as Currency)}
              >
                <DropdownMenuRadioItem value="USD">USD</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="EUR">EUR</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="SAR">SAR</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="outline"
                  className="h-auto rounded-xl px-3 py-2 text-sm font-medium"
                />
              }
            >
              {changePeriod} Change
              <ChevronDown className="text-muted-foreground size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuRadioGroup
                value={changePeriod}
                onValueChange={(value) =>
                  setChangePeriod(value as ChangePeriod)
                }
              >
                <DropdownMenuRadioItem value="24h">
                  24h Change
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="7d">
                  7d Change
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="30d">
                  30d Change
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border-border bg-card w-full min-w-0 overflow-hidden rounded-lg border">
        <div className="w-full max-w-full scrollbar-thin overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[720px] text-left md:min-w-[860px]">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-xs font-medium">
                <th className="px-4 py-3 font-medium">Asset</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">{changePeriod} Change</th>
                <th className="px-4 py-3 font-medium">Market Cap</th>
                <th className="px-4 py-3 font-medium">Chart</th>
                <th className="px-4 py-3 font-medium">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-muted-foreground px-4 py-10 text-center text-sm"
                  >
                    No markets match your search or filters.
                  </td>
                </tr>
              ) : (
                filtered.map((asset) => {
                  const pct = changeFor(asset, changePeriod);
                  const positive = pct >= 0;
                  return (
                    <tr
                      key={asset.symbol}
                      className="border-border/70 hover:bg-muted/40 border-b transition-colors last:border-0"
                    >
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <AssetIcon asset={asset} />
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-foreground text-sm font-semibold">
                                {asset.symbol}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleStar(asset.symbol)}
                                className={cn(
                                  'transition-colors',
                                  starred[asset.symbol]
                                    ? 'text-primary'
                                    : 'text-muted-foreground/50 hover:text-primary',
                                )}
                                aria-label="Toggle watchlist"
                              >
                                <Star
                                  className="size-3.5"
                                  fill={
                                    starred[asset.symbol]
                                      ? 'currentColor'
                                      : 'none'
                                  }
                                />
                              </button>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-muted-foreground text-xs">
                                {asset.name}
                              </span>
                              <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                                {asset.category === 'Metals'
                                  ? 'Metal'
                                  : asset.category === 'Stocks'
                                    ? 'Stock'
                                    : asset.category}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="text-foreground px-4 py-3.5 text-sm font-semibold">
                        {formatPrice(asset.priceUsd, currency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <p
                          className={cn(
                            'text-sm font-semibold',
                            positive ? 'text-success' : 'text-destructive',
                          )}
                        >
                          {formatPct(pct)}
                        </p>
                        <p
                          className={cn(
                            'text-xs',
                            positive
                              ? 'text-success/80'
                              : 'text-destructive/80',
                          )}
                        >
                          {formatAbsChange(asset.priceUsd, pct, currency)}
                        </p>
                      </td>
                      <td className="text-foreground px-4 py-3.5 text-sm">
                        {formatMarketCap(asset.marketCapUsd, currency)}
                      </td>
                      <td className="px-4 py-3.5">
                        <Sparkline
                          data={asset.data}
                          positive={positive}
                          className="h-8 w-24"
                          strokeWidth={1.75}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <button
                                type="button"
                                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
                                aria-label={`Actions for ${asset.symbol}`}
                              />
                            }
                          >
                            <MoreVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="min-w-44">
                            <DropdownMenuItem
                              render={
                                <Link
                                  href={`${'/trades'}?symbol=${encodeURIComponent(asset.symbol)}`}
                                />
                              }
                            >
                              <ArrowLeftRight className="size-4" />
                              Trade
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => toggleStar(asset.symbol)}
                            >
                              <Star className="size-4" />
                              {starred[asset.symbol]
                                ? 'Remove from watchlist'
                                : 'Add to watchlist'}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              render={
                                <Link
                                  href={`${'/ai-chat'}?q=${encodeURIComponent(`Analyze ${asset.symbol}`)}`}
                                />
                              }
                            >
                              <Sparkles className="size-4" />
                              Ask AI
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => void copySymbol(asset.symbol)}
                            >
                              <Copy className="size-4" />
                              {copied === asset.symbol
                                ? 'Copied'
                                : 'Copy symbol'}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
        <RefreshCw className="size-3.5" />
        Showing {filtered.length} markets · currency {currency} · {changePeriod}
      </div>
    </div>
  );
}
