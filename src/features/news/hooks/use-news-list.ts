'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { getNewsAction } from '@/features/news/actions/get-news';
import type { GetNewsInput, NewsListData } from '@/features/news/types';

export function useNewsList(initialData: NewsListData) {
  const [tag, setTag] = useState('all');
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [page, setPage] = useState(1);

  const [items, setItems] = useState(initialData.items);
  const [tags, setTags] = useState(initialData.tags);
  const [pagination, setPagination] = useState(initialData.pagination);

  useEffect(() => {
    let active = true;

    void getNewsAction({
      tag: tag === 'all' ? undefined : tag,
      search: search || undefined,
      page,
      per_page: 15,
    } satisfies GetNewsInput).then((result) => {
      if (!active) return;

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems(result.data.items);
      setTags(result.data.tags);
      setPagination(result.data.pagination);
    });

    return () => {
      active = false;
    };
  }, [tag, search, page]);

  function applySearch(event: React.FormEvent) {
    event.preventDefault();
    setPage(1);
    setSearch(searchDraft.trim());
  }

  function changeTag(next: string) {
    setPage(1);
    setTag(next);
  }

  return {
    tag,
    changeTag,
    searchDraft,
    setSearchDraft,
    applySearch,
    setPage,
    items,
    tags,
    pagination,
  };
}
