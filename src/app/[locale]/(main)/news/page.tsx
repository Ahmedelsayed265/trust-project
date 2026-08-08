import { getTranslations } from 'next-intl/server';
import { getNewsAction } from '@/features/news/actions/get-news';
import { NewsView } from '@/features/news';

export default async function NewsPage() {
  const t = await getTranslations('ErrorsPageLoad');
  const result = await getNewsAction({ per_page: 15 });

  if (!result.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('news')}</p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
      </div>
    );
  }

  return <NewsView initialData={result.data} />;
}
