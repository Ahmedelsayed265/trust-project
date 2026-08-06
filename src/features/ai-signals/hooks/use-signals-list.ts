'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getSignalsAction } from '@/features/ai-signals/actions/get-signals';
import type {
  GetSignalsInput,
  SignalSide,
  SignalStatus,
  SignalStrength,
  SignalsListData,
  SignalsStats,
} from '@/features/ai-signals/types';

export function useSignalsList(
  initialData: SignalsListData,
  initialStats: SignalsStats,
) {
  const [status, setStatus] = useState<SignalStatus>('active');
  const [side, setSide] = useState<'all' | SignalSide>('all');
  const [strength, setStrength] = useState<'all' | SignalStrength>('all');
  const [symbol, setSymbol] = useState('');
  const [symbolDraft, setSymbolDraft] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState(initialData.items);
  const [stats] = useState(initialStats);
  const [pagination, setPagination] = useState(initialData.pagination);

  useEffect(() => {
    let active = true;

    void getSignalsAction({
      status,
      side: side === 'all' ? undefined : side,
      strength: strength === 'all' ? undefined : strength,
      symbol: symbol || undefined,
      page,
      per_page: 20,
    } satisfies GetSignalsInput).then((result) => {
      if (!active) return;

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems(result.data.items);
      setPagination(result.data.pagination);
    });

    return () => {
      active = false;
    };
  }, [status, side, strength, symbol, page]);

  function applySymbolFilter(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    setSymbol(symbolDraft.trim());
  }

  function resetPage() {
    setPage(1);
  }

  return {
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
  };
}
