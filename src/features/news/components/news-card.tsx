import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { sentimentBadgeClass } from '@/features/news/lib/news-display';
import type { NewsItem } from '@/features/news/types';
import { cn } from '@/lib/utils';

export function NewsCard({ article }: { article: NewsItem }) {
  return (
    <Link href={`/news/${article.slug}`} className="group block">
      <Card
        className={cn(
          'bg-card hover:bg-card hover:border-primary/40 transition-colors',
          article.is_featured && 'border-primary/30',
        )}
      >
        <CardContent className="space-y-2">
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
              <Badge className="border-0">Featured</Badge>
            ) : null}
            <span className="text-muted-foreground text-xs">
              {article.time}
            </span>
            {article.source ? (
              <span className="text-muted-foreground text-xs">
                · {article.source}
              </span>
            ) : null}
          </div>
          <h2 className="text-foreground group-hover:text-primary text-base font-semibold transition-colors">
            {article.title}
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {article.summary}
          </p>
          {article.symbols.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
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
        </CardContent>
      </Card>
    </Link>
  );
}
