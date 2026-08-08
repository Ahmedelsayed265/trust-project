'use client';

import Link from 'next/link';
import { MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/shared/components/page-header';
import { HelpIcon } from '@/features/help/lib/help-icons';
import { useHelpList } from '@/features/help/hooks/use-help-list';
import { HELP_CATEGORY_LABELS, type HelpListData } from '@/features/help/types';
import { cn } from '@/lib/utils';

export function HelpView({ initialData }: { initialData: HelpListData }) {
  const {
    category,
    changeCategory,
    searchDraft,
    setSearchDraft,
    applySearch,
    items,
    categories,
    loading,
  } = useHelpList(initialData);

  const tabs = [
    { id: 'all', label: 'All' },
    ...categories.map((item) => ({
      id: item,
      label: HELP_CATEGORY_LABELS[item] ?? item,
    })),
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="Help Center"
        description="Guides and support for trading on TrustAI."
        actions={
          <Button
            className="rounded-xl"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            <MessageCircle />
            Contact Support
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => changeCategory(tab.id)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors',
                category === tab.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <form
          onSubmit={applySearch}
          className="flex w-full max-w-xs items-center gap-2"
        >
          <Input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search guides"
            className="bg-card h-10 rounded-[12px]!"
            aria-label="Search help articles"
          />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="bg-card size-10 shrink-0 rounded-[12px]!"
            aria-label="Search help"
          >
            <Search className="size-4" />
          </Button>
        </form>
      </div>

      <div className={cn('grid gap-4 md:grid-cols-2', loading && 'opacity-70')}>
        {items.length === 0 ? (
          <Card className="md:col-span-2">
            <CardContent className="py-10 text-center">
              <p className="text-foreground text-sm font-medium">
                No guides found
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Try another category or search term.
              </p>
            </CardContent>
          </Card>
        ) : (
          items.map((article) => (
            <Link
              key={article.id}
              href={`/help/${article.slug}`}
              className="group block"
            >
              <Card className="group-hover:border-primary/30 group-hover:bg-muted/20 h-full transition-colors">
                <CardHeader className="flex-row items-start gap-3 space-y-0">
                  <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                    <HelpIcon name={article.icon} className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-muted-foreground text-xs font-medium capitalize">
                      {HELP_CATEGORY_LABELS[article.category] ??
                        article.category}
                    </p>
                    <CardTitle className="mt-1 text-base">
                      {article.title}
                    </CardTitle>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {article.excerpt}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </div>

      <Card className="border-primary/20 bg-linear-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-base font-semibold">
              Need plan help?
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Review tiers, billing dates, and upgrade options anytime.
            </p>
          </div>
          <Button
            className="rounded-xl"
            nativeButton={false}
            render={<Link href="/profile/plans" />}
          >
            Manage Plans
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
