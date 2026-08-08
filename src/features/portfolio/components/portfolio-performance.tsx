'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';
import { EquityChart } from '@/features/portfolio/components/equity-chart';
import { getPortfolioHistoryAction } from '@/features/portfolio/actions/get-portfolio';
import {
  PERFORMANCE_RANGES,
  type PerformanceRangeId,
} from '@/features/portfolio/lib/portfolio-data';
import type { PortfolioHistoryData } from '@/features/portfolio/types';

export function PortfolioPerformance({
  initialHistory,
  currency,
}: {
  initialHistory: PortfolioHistoryData | null;
  currency: string;
}) {
  const t = useTranslations('Portfolio');
  const [rangeId, setRangeId] = useState<PerformanceRangeId>('1M');
  const [history, setHistory] = useState(initialHistory);
  const [pending, startTransition] = useTransition();

  function selectRange(next: PerformanceRangeId) {
    if (next === rangeId) return;
    const range = PERFORMANCE_RANGES.find((item) => item.id === next);
    if (!range) return;

    setRangeId(next);
    startTransition(async () => {
      const result = await getPortfolioHistoryAction(range.apiRange);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      setHistory(result.data);
    });
  }

  const points =
    history?.points.map((point) => ({
      label: point.label,
      value: point.equity,
    })) ?? [];
  const positive = history?.is_positive ?? true;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div className="min-w-0">
          <CardTitle>{t('performance')}</CardTitle>
          <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
            {history ? formatMoney(history.end, currency) : '—'}
          </p>
          {history && (
            <p
              className={cn(
                'text-xs font-semibold',
                positive ? 'text-success' : 'text-destructive',
              )}
            >
              {formatSignedMoney(history.change, currency)} (
              {formatPct(history.change_pct)}){' '}
              <span className="text-muted-foreground">
                {t('pastRange', { range: rangeId })}
              </span>
            </p>
          )}
        </div>

        <div className="bg-muted flex shrink-0 items-center gap-0.5 rounded-lg p-0.5">
          {PERFORMANCE_RANGES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => selectRange(item.id)}
              disabled={pending}
              className={cn(
                'rounded-md px-2.5 py-1 text-xs font-medium transition-colors disabled:opacity-60',
                item.id === rangeId
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.id}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        {pending ? (
          <Skeleton className="h-55 w-full" />
        ) : points.length < 2 ? (
          <div className="text-muted-foreground flex h-55 items-center justify-center text-sm">
            {t('notEnoughHistory')}
          </div>
        ) : (
          <EquityChart
            points={points}
            positive={positive}
            formatValue={(value) => formatMoney(value, currency)}
          />
        )}
      </CardContent>
    </Card>
  );
}
