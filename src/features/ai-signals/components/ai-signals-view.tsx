'use client';

import Link from 'next/link';
import type {
  SignalSide,
  SignalStatus,
  SignalStrength,
  SignalsListData,
  SignalsStats,
} from '@/features/ai-signals/types';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/shared/components/page-header';
import { SignalsFilters } from '@/features/ai-signals/components/signals-filters';
import { SignalsList } from '@/features/ai-signals/components/signals-list';
import { SignalsPaginationBar } from '@/features/ai-signals/components/signals-pagination';
import { SignalsStatsCards } from '@/features/ai-signals/components/signals-stats';
import { useSignalsList } from '@/features/ai-signals/hooks/use-signals-list';

export function AiSignalsView({
  initialData,
  initialStats,
}: {
  initialData: SignalsListData;
  initialStats: SignalsStats;
}) {
  const {
    status,
    setStatus,
    side,
    setSide,
    strength,
    setStrength,
    symbolDraft,
    setSymbolDraft,
    setPage,
    items,
    stats,
    pagination,
    applySymbolFilter,
    resetPage,
  } = useSignalsList(initialData, initialStats);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="AI Signals"
        description="Confidence-scored trade ideas updated in real time."
        actions={
          <Button className="rounded-xl" render={<Link href="/trades" />}>
            Open Trade Desk
          </Button>
        }
      />

      <SignalsStatsCards stats={stats} />

      <SignalsFilters
        status={status}
        side={side}
        strength={strength}
        symbolDraft={symbolDraft}
        onStatusChange={(value: SignalStatus) => {
          resetPage();
          setStatus(value);
        }}
        onSideChange={(value: 'all' | SignalSide) => {
          resetPage();
          setSide(value);
        }}
        onStrengthChange={(value: 'all' | SignalStrength) => {
          resetPage();
          setStrength(value);
        }}
        onSymbolDraftChange={setSymbolDraft}
        onSymbolSubmit={applySymbolFilter}
      />

      <SignalsList items={items} />

      <SignalsPaginationBar pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
