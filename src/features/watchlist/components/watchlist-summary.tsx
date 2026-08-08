'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import type { WatchlistSummary } from '@/features/watchlist/types';

export function WatchlistSummaryCards({
  summary,
}: {
  summary: WatchlistSummary;
}) {
  const t = useTranslations('Watchlist');
  const cards = [
    { label: t('watching'), value: String(summary.total) },
    { label: t('gainers'), value: String(summary.gainers) },
    { label: t('losers'), value: String(summary.losers) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardContent>
            <p className="text-muted-foreground text-xs">{card.label}</p>
            <p className="text-foreground mt-1 text-2xl font-bold">
              {card.value}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
