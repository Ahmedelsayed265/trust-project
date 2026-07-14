"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

const categories = [
  "All",
  "Crypto",
  "Stocks",
  "Metals",
  "US",
  "Europe",
  "MENA",
  "India",
  "Asia",
] as const;

export function MarketCategoryTabs({
  value = "All",
  onChange,
}: {
  value?: string;
  onChange?: (category: string) => void;
}) {
  return (
    <div className="flex w-full min-w-0 items-center gap-2">
      <div className="scrollbar-none flex min-w-0 flex-1 items-center gap-2 overflow-x-auto overscroll-x-contain pb-0.5">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onChange?.(category)}
            className={cn(
              "shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
              value === category
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground ring-1 ring-border hover:bg-muted hover:text-foreground"
            )}
          >
            {category}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="shrink-0 rounded-xl border border-border bg-card p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Search markets"
      >
        <Search className="size-4" />
      </button>
    </div>
  );
}
