'use client';

import { useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftRight,
  ChevronLeft,
  ChevronRight,
  Copy,
  MoreVertical,
  RefreshCw,
  Sparkles,
  Star,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MarketsToolbar } from '@/features/markets/components/markets-toolbar';
import {
  assetClassLabel,
  formatCompactMoney,
  isWatchlisted,
  marketIconBg,
} from '@/features/markets/lib/market-display';
import type {
  MarketSort,
  MarketSymbol,
  MarketsPagination,
} from '@/features/markets/types';
import { toggleWatchlistAction } from '@/features/watchlist/actions/watchlist';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/shared/components/sparkline';
import { formatMoney, formatPct } from '@/shared/trading';

type MarketsTableProps = {
  items: MarketSymbol[];
  pagination: MarketsPagination;
  sort: MarketSort | 'default';
  direction: 'asc' | 'desc';
  onSortChange: (value: MarketSort | 'default') => void;
  onDirectionChange: (value: 'asc' | 'desc') => void;
  onPageChange: (page: number) => void;
};

export function MarketsTable({
  items,
  pagination,
  sort,
  direction,
  onSortChange,
  onDirectionChange,
  onPageChange,
}: MarketsTableProps) {
  const [starred, setStarred] = useState<Record<string, boolean>>({});
  const [gainersOnly, setGainersOnly] = useState(false);
  const [losersOnly, setLosersOnly] = useState(false);
  const [watchlistOnly, setWatchlistOnly] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [, startToggle] = useTransition();

  function isStarred(item: MarketSymbol) {
    if (Object.hasOwn(starred, item.symbol)) return starred[item.symbol];
    return isWatchlisted(item.is_watchlisted);
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const watching = Object.hasOwn(starred, item.symbol)
        ? starred[item.symbol]
        : isWatchlisted(item.is_watchlisted);
      if (watchlistOnly && !watching) return false;
      if (gainersOnly && !item.is_positive) return false;
      if (losersOnly && item.is_positive) return false;
      return true;
    });
  }, [items, starred, watchlistOnly, gainersOnly, losersOnly]);

  function toggleStar(item: MarketSymbol) {
    const previous = isStarred(item);
    setStarred((prev) => ({ ...prev, [item.symbol]: !previous }));

    startToggle(async () => {
      const result = await toggleWatchlistAction(item.symbol);
      if (!result.ok) {
        setStarred((prev) => ({ ...prev, [item.symbol]: previous }));
        toast.error(result.message);
        return;
      }

      const watching = result.data.watching ?? result.data.in_watchlist;
      if (typeof watching === 'boolean') {
        setStarred((prev) => ({ ...prev, [item.symbol]: watching }));
      }
    });
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
      <MarketsToolbar
        gainersOnly={gainersOnly}
        losersOnly={losersOnly}
        watchlistOnly={watchlistOnly}
        sort={sort}
        direction={direction}
        onGainersOnlyChange={setGainersOnly}
        onLosersOnlyChange={setLosersOnly}
        onWatchlistOnlyChange={setWatchlistOnly}
        onSortChange={onSortChange}
        onDirectionChange={onDirectionChange}
        onClearFilters={() => {
          setGainersOnly(false);
          setLosersOnly(false);
          setWatchlistOnly(false);
        }}
      />

      <div className="border-border bg-card w-full min-w-0 overflow-hidden rounded-lg border">
        <div className="w-full max-w-full scrollbar-thin overflow-x-auto overscroll-x-contain">
          <table className="w-full min-w-[720px] text-left md:min-w-[860px]">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-xs font-medium">
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
                filtered.map((item) => (
                  <MarketRow
                    key={item.id}
                    item={item}
                    starred={isStarred(item)}
                    copied={copied === item.symbol}
                    onToggleStar={() => toggleStar(item)}
                    onCopy={() => void copySymbol(item.symbol)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted-foreground flex items-center gap-1.5 text-xs">
          <RefreshCw className="size-3.5" />
          Showing {filtered.length} of {pagination.total} markets
        </p>

        {pagination.last_page > 1 ? (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!pagination.prev_page_url}
              onClick={() =>
                onPageChange(Math.max(1, pagination.current_page - 1))
              }
            >
              <ChevronLeft className="size-4" />
              Prev
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="rounded-xl"
              disabled={!pagination.next_page_url}
              onClick={() => onPageChange(pagination.current_page + 1)}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MarketRow({
  item,
  starred,
  copied,
  onToggleStar,
  onCopy,
}: {
  item: MarketSymbol;
  starred: boolean;
  copied: boolean;
  onToggleStar: () => void;
  onCopy: () => void;
}) {
  const router = useRouter();
  const href = `/markets/${encodeURIComponent(item.symbol)}`;

  function openDetail() {
    router.push(href);
  }

  return (
    <tr
      role="link"
      tabIndex={0}
      onClick={openDetail}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openDetail();
        }
      }}
      className="border-border/70 hover:bg-muted/40 cursor-pointer border-b transition-colors last:border-0"
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              marketIconBg(item.asset_class),
            )}
          >
            {item.icon_label || item.display_symbol.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-foreground text-sm font-semibold">
                {item.display_symbol || item.symbol}
              </span>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleStar();
                }}
                className={cn(
                  'transition-colors',
                  starred
                    ? 'text-primary'
                    : 'text-muted-foreground/50 hover:text-primary',
                )}
                aria-label="Toggle watchlist"
              >
                <Star
                  className="size-3.5"
                  fill={starred ? 'currentColor' : 'none'}
                />
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-xs">{item.name}</span>
              <span className="bg-muted text-muted-foreground rounded-full px-1.5 py-0.5 text-[10px] font-medium">
                {assetClassLabel(item.asset_class)}
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="text-foreground px-4 py-3.5 text-sm font-semibold">
        {formatMoney(item.price)}
      </td>
      <td className="px-4 py-3.5">
        <p
          className={cn(
            'text-sm font-semibold',
            item.is_positive ? 'text-success' : 'text-destructive',
          )}
        >
          {formatPct(item.change_24h_pct)}
        </p>
        <p
          className={cn(
            'text-xs',
            item.is_positive ? 'text-success/80' : 'text-destructive/80',
          )}
        >
          {formatMoney(Math.abs(item.change_24h))}
        </p>
      </td>
      <td className="text-foreground px-4 py-3.5 text-sm">
        {item.market_cap != null ? formatCompactMoney(item.market_cap) : '—'}
      </td>
      <td className="px-4 py-3.5">
        <Sparkline
          data={item.sparkline}
          positive={item.is_positive}
          className="h-8 w-24"
          strokeWidth={1.75}
        />
      </td>
      <td
        className="px-4 py-3.5"
        onClick={(event) => event.stopPropagation()}
        onKeyDown={(event) => event.stopPropagation()}
      >
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button
                type="button"
                className="text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg p-1.5 transition-colors"
                aria-label={`Actions for ${item.symbol}`}
              />
            }
          >
            <MoreVertical className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-44">
            <DropdownMenuItem render={<Link href={href} />}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link
                  href={`/trades?symbol=${encodeURIComponent(item.symbol)}`}
                />
              }
            >
              <ArrowLeftRight className="size-4" />
              Trade
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onToggleStar}>
              <Star className="size-4" />
              {starred ? 'Remove from watchlist' : 'Add to watchlist'}
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link
                  href={`/ai-chat?q=${encodeURIComponent(`Analyze ${item.display_symbol || item.symbol}`)}`}
                />
              }
            >
              <Sparkles className="size-4" />
              Ask AI
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onCopy}>
              <Copy className="size-4" />
              {copied ? 'Copied' : 'Copy symbol'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </td>
    </tr>
  );
}
