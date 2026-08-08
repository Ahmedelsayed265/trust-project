'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { NewsCard } from '@/features/news/components/news-card';
import type { NewsItem } from '@/features/news/types';

export function NewsList({ items }: { items: NewsItem[] }) {
  const t = useTranslations('News');

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-foreground text-sm font-medium">{t('empty')}</p>
          <p className="text-muted-foreground mt-1 text-sm">{t('emptyHint')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  );
}
