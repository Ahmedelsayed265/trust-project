'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { MessageCircle, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PageHeader } from '@/shared/components/page-header';
import { HelpIcon } from '@/features/help/lib/help-icons';
import { useHelpList } from '@/features/help/hooks/use-help-list';
import { type HelpListData } from '@/features/help/types';
import { cn } from '@/lib/utils';

const HELP_CATEGORY_KEY_MAP: Record<string, string> = {
  'getting-started': 'gettingStarted',
  trading: 'trading',
  security: 'security',
  billing: 'billing',
};

export function HelpView({ initialData }: { initialData: HelpListData }) {
  const t = useTranslations('Help');
  const tCommon = useTranslations('Common');
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

  function categoryLabel(key: string) {
    const messageKey = HELP_CATEGORY_KEY_MAP[key];
    if (messageKey && t.has(`categories.${messageKey}`)) {
      return t(`categories.${messageKey}` as 'categories.trading');
    }
    return key;
  }

  const tabs = [
    { id: 'all', label: tCommon('all') },
    ...categories.map((item) => ({
      id: item,
      label: categoryLabel(item),
    })),
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={t('title')}
        description={t('description')}
        actions={
          <Button
            className="rounded-xl"
            nativeButton={false}
            render={<Link href="/contact" />}
          >
            <MessageCircle />
            {t('contactSupport')}
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
            placeholder={t('searchPlaceholder')}
            className="bg-card h-10 rounded-[12px]!"
            aria-label={t('searchAria')}
          />
          <Button
            type="submit"
            variant="outline"
            size="icon"
            className="bg-card size-10 shrink-0 rounded-[12px]!"
            aria-label={t('searchButtonAria')}
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
                {t('empty')}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('emptyHint')}
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
                      {categoryLabel(article.category)}
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
              {t('needPlanHelp')}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('needPlanHelpDesc')}
            </p>
          </div>
          <Button
            className="rounded-xl"
            nativeButton={false}
            render={<Link href="/profile/plans" />}
          >
            {t('managePlans')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
