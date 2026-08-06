'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/page-header';
import { removeFromWatchlistAction } from '@/features/watchlist/actions/watchlist';
import { WatchlistRow } from '@/features/watchlist/components/watchlist-row';
import { WatchlistSummaryCards } from '@/features/watchlist/components/watchlist-summary';
import type { WatchlistData, WatchlistItem } from '@/features/watchlist/types';

function summaryFromItems(items: WatchlistItem[]) {
  const gainers = items.filter((item) => item.is_positive).length;
  return {
    total: items.length,
    gainers,
    losers: items.length - gainers,
  };
}

export function WatchlistView({ initialData }: { initialData: WatchlistData }) {
  const [items, setItems] = useState(initialData.items);
  const [summary, setSummary] = useState(initialData.summary);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [pending, startTransition] = useTransition();

  function onRemove(item: WatchlistItem) {
    setRemovingId(item.id);
    startTransition(async () => {
      const result = await removeFromWatchlistAction(item.symbol);

      if (!result.ok) {
        setRemovingId(null);
        toast.error(result.message);
        return;
      }

      setItems((prev) => {
        const next = prev.filter((row) => row.id !== item.id);
        setSummary(summaryFromItems(next));
        return next;
      });
      setRemovingId(null);
      toast.success('Removed from watchlist.');
    });
  }

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Watchlist"
        description="Assets you follow across markets."
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/markets" />}
          >
            Browse Markets
          </Button>
        }
      />

      <WatchlistSummaryCards summary={summary} />

      <Card>
        <CardContent className="p-0">
          {items.length === 0 ? (
            <p className="text-muted-foreground px-5 py-10 text-center text-sm">
              Your watchlist is empty.
            </p>
          ) : (
            <ul className="divide-border divide-y">
              {items.map((item) => (
                <WatchlistRow
                  key={item.id}
                  item={item}
                  onRemove={() => onRemove(item)}
                  removing={pending && removingId === item.id}
                />
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
