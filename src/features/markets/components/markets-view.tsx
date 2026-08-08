'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { MarketCategoryTabs } from '@/features/markets/components/market-category-tabs';
import { MarketSummaryCards } from '@/features/markets/components/market-summary-cards';
import { MarketsTable } from '@/features/markets/components/markets-table';
import { useMarketsList } from '@/features/markets/hooks/use-markets-list';
import type {
  MarketCategory,
  MarketsListData,
  MarketsSummary,
} from '@/features/markets/types';

export function MarketsView({
  initialData,
  initialSummary,
  categories,
}: {
  initialData: MarketsListData;
  initialSummary: MarketsSummary;
  categories: MarketCategory[];
}) {
  const t = useTranslations('Markets');
  const [searchOpen, setSearchOpen] = useState(false);
  const {
    assetClass,
    changeAssetClass,
    searchDraft,
    setSearchDraft,
    applySearch,
    sort,
    changeSort,
    direction,
    setDirection,
    setPage,
    items,
    summary,
    pagination,
  } = useMarketsList(initialData, initialSummary);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('description')}</p>
      </div>

      <MarketCategoryTabs
        categories={categories}
        value={assetClass}
        onChange={changeAssetClass}
        searchDraft={searchDraft}
        onSearchDraftChange={setSearchDraft}
        onSearchSubmit={applySearch}
        searchOpen={searchOpen}
        onSearchOpenChange={setSearchOpen}
      />

      <MarketSummaryCards summary={summary} />

      <MarketsTable
        items={items}
        pagination={pagination}
        sort={sort}
        direction={direction}
        onSortChange={changeSort}
        onDirectionChange={(value) => {
          setPage(1);
          setDirection(value);
        }}
        onPageChange={setPage}
      />
    </div>
  );
}
