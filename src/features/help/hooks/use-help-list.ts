'use client';

import { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import { getHelpAction } from '@/features/help/actions/get-help';
import type { GetHelpInput, HelpListData } from '@/features/help/types';

export function useHelpList(initialData: HelpListData) {
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [items, setItems] = useState(initialData.items);
  const [categories, setCategories] = useState(initialData.categories);
  const [loading, startLoad] = useTransition();

  useEffect(() => {
    startLoad(async () => {
      const result = await getHelpAction({
        category: category === 'all' ? undefined : category,
        search: search || undefined,
      } satisfies GetHelpInput);

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems(result.data.items);
      setCategories(result.data.categories);
    });
  }, [category, search]);

  function applySearch(event: React.FormEvent) {
    event.preventDefault();
    setSearch(searchDraft.trim());
  }

  function changeCategory(next: string) {
    setCategory(next);
  }

  return {
    category,
    changeCategory,
    searchDraft,
    setSearchDraft,
    applySearch,
    items,
    categories,
    loading,
  };
}
