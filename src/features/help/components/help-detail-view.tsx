import Link from 'next/link';
import { ArrowLeft, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/page-header';
import { HelpIcon } from '@/features/help/lib/help-icons';
import { HELP_CATEGORY_LABELS, type HelpArticle } from '@/features/help/types';

export function HelpDetailView({ article }: { article: HelpArticle }) {
  const paragraphs = article.body
    .split(/\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={article.title}
        description={article.excerpt}
        actions={
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/help" />}
          >
            <ArrowLeft className="size-4" />
            Back
          </Button>
        }
      />

      <Card>
        <CardContent className="space-y-4 pt-4">
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl">
              <HelpIcon name={article.icon} className="size-5" />
            </div>
            <Badge variant="secondary" className="border-0 capitalize">
              {HELP_CATEGORY_LABELS[article.category] ?? article.category}
            </Badge>
            <Badge variant="secondary" className="gap-1 border-0">
              <Eye className="size-3.5" />
              {article.views} views
            </Badge>
          </div>

          <div className="space-y-3">
            {paragraphs.map((paragraph, index) => (
              <p
                key={`${index}-${paragraph.slice(0, 24)}`}
                className="text-foreground text-sm leading-relaxed whitespace-pre-wrap"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/20 bg-linear-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-base font-semibold">
              Still need help?
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Browse more guides or send us a message.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              nativeButton={false}
              render={<Link href="/help" />}
            >
              All guides
            </Button>
            <Button
              className="rounded-xl"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
