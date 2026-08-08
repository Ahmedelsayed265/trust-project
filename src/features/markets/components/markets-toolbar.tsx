'use client';

import { useTranslations } from 'next-intl';
import { ChevronDown, Filter, Star } from 'lucide-react';
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
import type { MarketSort } from '@/features/markets/types';
import { cn } from '@/lib/utils';

type MarketsToolbarProps = {
  gainersOnly: boolean;
  losersOnly: boolean;
  watchlistOnly: boolean;
  sort: MarketSort | 'default';
  direction: 'asc' | 'desc';
  onGainersOnlyChange: (value: boolean) => void;
  onLosersOnlyChange: (value: boolean) => void;
  onWatchlistOnlyChange: (value: boolean) => void;
  onSortChange: (value: MarketSort | 'default') => void;
  onDirectionChange: (value: 'asc' | 'desc') => void;
  onClearFilters: () => void;
};

const SORT_LABEL_KEYS = {
  default: 'sortDefault',
  change: 'sortChange',
  price: 'sortPrice',
  volume: 'sortVolume',
  name: 'sortName',
  market_cap: 'sortMarketCap',
} as const;

export function MarketsToolbar({
  gainersOnly,
  losersOnly,
  watchlistOnly,
  sort,
  direction,
  onGainersOnlyChange,
  onLosersOnlyChange,
  onWatchlistOnlyChange,
  onSortChange,
  onDirectionChange,
  onClearFilters,
}: MarketsToolbarProps) {
  const t = useTranslations('Markets');
  const sortLabel = t(SORT_LABEL_KEYS[sort]);

  return (
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
            {t('filters')}
            <ChevronDown className="text-muted-foreground size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="min-w-48">
            <DropdownMenuGroup>
              <DropdownMenuLabel>{t('performance')}</DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={gainersOnly}
                onCheckedChange={(checked) => {
                  onGainersOnlyChange(checked === true);
                  if (checked) onLosersOnlyChange(false);
                }}
              >
                {t('gainersOnly')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={losersOnly}
                onCheckedChange={(checked) => {
                  onLosersOnlyChange(checked === true);
                  if (checked) onGainersOnlyChange(false);
                }}
              >
                {t('losersOnly')}
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={watchlistOnly}
                onCheckedChange={(checked) =>
                  onWatchlistOnlyChange(checked === true)
                }
              >
                {t('watchlistOnly')}
              </DropdownMenuCheckboxItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onClearFilters}>
              {t('clearFilters')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          type="button"
          onClick={() => onWatchlistOnlyChange(!watchlistOnly)}
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
          {t('watchlist')}
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
            {t('sortPrefix')} {sortLabel}
            <ChevronDown className="text-muted-foreground size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-40">
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(value) =>
                onSortChange(value as MarketSort | 'default')
              }
            >
              <DropdownMenuRadioItem value="default">
                {t('sortDefault')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="change">
                {t('sortChange')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="price">
                {t('sortPrice')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="volume">
                {t('sortVolume')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="name">
                {t('sortName')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="market_cap">
                {t('sortMarketCap')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="outline"
                className="h-auto rounded-xl px-3 py-2 text-sm font-medium"
                disabled={sort === 'default'}
              />
            }
          >
            {direction === 'desc' ? t('desc') : t('asc')}
            <ChevronDown className="text-muted-foreground size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-28">
            <DropdownMenuRadioGroup
              value={direction}
              onValueChange={(value) =>
                onDirectionChange(value as 'asc' | 'desc')
              }
            >
              <DropdownMenuRadioItem value="desc">
                {t('desc')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="asc">
                {t('asc')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
