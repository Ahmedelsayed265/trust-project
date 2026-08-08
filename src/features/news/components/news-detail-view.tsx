import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sentimentBadgeClass } from '@/features/news/lib/news-display';
import type { NewsArticle } from '@/features/news/types';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/shared/components/page-header';

export async function NewsDetailView({ article }: { article: NewsArticle }) {
  const t = await getTranslations('News');
  const tCommon = await getTranslations('Common');
  const paragraphs = article.body
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={article.title}
        description={`${article.source} · ${article.time}`}
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/news" />}
          >
            <ArrowLeft className="size-4" />
            {tCommon('back')}
          </Button>
        }
      />

      <Card>
        {article.image ? (
          // eslint-disable-next-line @next/next/no-img-element -- remote CMS image URL
          <img
            src={article.image}
            alt=""
            className="border-border aspect-[2/1] w-full border-b object-cover"
          />
        ) : null}
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="border-0">
              {article.tag}
            </Badge>
            <Badge
              className={cn(
                'border-0 capitalize',
                sentimentBadgeClass(article.sentiment),
              )}
            >
              {article.sentiment}
            </Badge>
            {article.is_featured ? (
              <Badge className="border-0">{t('featured')}</Badge>
            ) : null}
          </div>

          <p className="text-muted-foreground text-sm leading-relaxed">
            {article.summary}
          </p>

          <div className="space-y-3">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${index}-${paragraph.slice(0, 24)}`}
                className="text-foreground text-sm leading-relaxed"
              >
                {paragraph}
              </p>
            ))}
          </div>

          {article.symbols.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 border-t pt-4">
              {article.symbols.map((symbol) => (
                <Badge
                  key={symbol}
                  variant="outline"
                  className="text-muted-foreground font-normal"
                >
                  {symbol}
                </Badge>
              ))}
            </div>
          ) : null}

          {article.source_url ? (
            <Button
              variant="outline"
              className="rounded-xl"
              render={
                <a href={article.source_url} target="_blank" rel="noreferrer" />
              }
            >
              {t('readOriginal')}
              <ExternalLink className="size-3.5" />
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
