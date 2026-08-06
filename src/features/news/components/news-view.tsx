'use client';

import { PageHeader } from '@/shared/components/page-header';
import { NewsFilters } from '@/features/news/components/news-filters';
import { NewsList } from '@/features/news/components/news-list';
import { NewsPaginationBar } from '@/features/news/components/news-pagination';
import { useNewsList } from '@/features/news/hooks/use-news-list';
import type { NewsListData } from '@/features/news/types';

export function NewsView({ initialData }: { initialData: NewsListData }) {
  const {
    tag,
    changeTag,
    searchDraft,
    setSearchDraft,
    applySearch,
    setPage,
    items,
    tags,
    pagination,
  } = useNewsList(initialData);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="News"
        description="Market headlines curated for active traders."
      />

      <NewsFilters
        tag={tag}
        tags={tags}
        searchDraft={searchDraft}
        onTagChange={changeTag}
        onSearchDraftChange={setSearchDraft}
        onSearchSubmit={applySearch}
      />

      <NewsList items={items} />

      <NewsPaginationBar pagination={pagination} onPageChange={setPage} />
    </div>
  );
}
