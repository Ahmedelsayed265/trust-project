"use client";

import { useState } from "react";
import { MarketCategoryTabs } from "@/features/markets/components/market-category-tabs";
import { MarketSummaryCards } from "@/features/markets/components/market-summary-cards";
import { MarketsTable } from "@/features/markets/components/markets-table";

export function MarketsView() {
  const [category, setCategory] = useState("All");

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          Markets
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Explore global markets and trade smarter.
        </p>
      </div>

      <MarketCategoryTabs value={category} onChange={setCategory} />
      <MarketSummaryCards />
      <MarketsTable category={category} />
    </div>
  );
}
