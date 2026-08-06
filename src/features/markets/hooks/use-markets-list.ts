'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getMarketsAction } from '@/features/markets/actions/get-markets';
import type {
  GetMarketsInput,
  MarketSort,
  MarketsListData,
  MarketsSummary,
} from '@/features/markets/types';

export function useMarketsList(
  initialData: MarketsListData,
  initialSummary: MarketsSummary,
) {
  const [assetClass, setAssetClass] = useState('all');
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [sort, setSort] = useState<MarketSort | 'default'>('default');
  const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState(initialData.items);
  const [summary] = useState(initialSummary);
  const [pagination, setPagination] = useState(initialData.pagination);

  useEffect(() => {
    let active = true;

    void getMarketsAction({
      asset_class: assetClass === 'all' ? undefined : assetClass,
      search: search || undefined,
      sort: sort === 'default' ? undefined : sort,
      direction: sort === 'default' ? undefined : direction,
      page,
      per_page: 20,
    } satisfies GetMarketsInput).then((result) => {
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
  }, [assetClass, search, sort, direction, page]);

  function changeAssetClass(next: string) {
    setPage(1);
    setAssetClass(next);
  }

  function applySearch(event?: React.FormEvent) {
    event?.preventDefault();
    setPage(1);
    setSearch(searchDraft.trim());
  }

  function changeSort(next: MarketSort | 'default') {
    setPage(1);
    setSort(next);
  }

  return {
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
  };
}
