'use client';

import { useState } from 'react';
import { MarketCategoryTabs } from '@/features/markets/components/market-category-tabs';
import { MarketSummaryCards } from '@/features/markets/components/market-summary-cards';
import { MarketsTable } from '@/features/markets/components/markets-table';

export function MarketsView() {
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          Markets
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Explore global markets and trade smarter.
        </p>
      </div>

      <MarketCategoryTabs
        value={category}
        onChange={setCategory}
        search={search}
        onSearchChange={setSearch}
        searchOpen={searchOpen}
        onSearchOpenChange={setSearchOpen}
      />
      <MarketSummaryCards />
      <MarketsTable category={category} search={search} />
    </div>
  );
}
