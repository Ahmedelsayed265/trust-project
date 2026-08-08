import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNewsBySlugAction } from '@/features/news/actions/get-news';
import { NewsDetailView } from '@/features/news/components/news-detail-view';
import { Button } from '@/components/ui/button';

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const t = await getTranslations('ErrorsPageLoad');
  const tNews = await getTranslations('News');
  const { slug } = await params;
  const result = await getNewsBySlugAction(slug);

  if (!result.ok) {
    return (
      <div className="border-border bg-card mx-auto max-w-md rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('article')}</p>
        <p className="text-muted-foreground mt-1 text-sm">{result.message}</p>
        <Button
          variant="outline"
          className="mt-4 rounded-xl"
          render={<Link href="/news" />}
        >
          {tNews('backToNews')}
        </Button>
      </div>
    );
  }

  return <NewsDetailView article={result.data} />;
}
