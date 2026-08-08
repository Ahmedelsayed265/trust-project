'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState, useTransition } from 'react';
import { Link } from '@/i18n/navigation';
import { MessageCircle } from 'lucide-react';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/shared/components/page-header';
import { getFaqsAction } from '@/features/faq/actions/get-faqs';
import { type FaqItem, type FaqsData } from '@/features/faq/types';
import { cn } from '@/lib/utils';

type Filter = 'all' | string;

const FAQ_CATEGORY_KEYS = [
  'general',
  'trading',
  'account',
  'billing',
  'security',
] as const;

function groupByCategory(
  items: FaqItem[],
  labelFor: (category: string) => string,
) {
  const groups = new Map<string, FaqItem[]>();

  for (const item of items) {
    const key = item.category || 'general';
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return [...groups.entries()].map(([category, faqs]) => ({
    category,
    title: labelFor(category),
    items: faqs,
  }));
}

export function FaqView({ initialData }: { initialData: FaqsData }) {
  const t = useTranslations('Faq');
  const tHelp = useTranslations('Help');
  const tCommon = useTranslations('Common');
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState(initialData.items);
  const [categories, setCategories] = useState(initialData.categories);
  const [loading, startLoad] = useTransition();

  function categoryLabel(category: string) {
    if (
      (FAQ_CATEGORY_KEYS as readonly string[]).includes(category) &&
      t.has(`categories.${category}`)
    ) {
      return t(`categories.${category}` as 'categories.general');
    }
    return category;
  }

  useEffect(() => {
    startLoad(async () => {
      const result = await getFaqsAction({
        category: filter === 'all' ? undefined : filter,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      setItems(result.data.items);
      setCategories(result.data.categories);
    });
  }, [filter]);

  const sections = useMemo(() => {
    function labelFor(category: string) {
      if (
        (FAQ_CATEGORY_KEYS as readonly string[]).includes(category) &&
        t.has(`categories.${category}`)
      ) {
        return t(`categories.${category}` as 'categories.general');
      }
      return category;
    }
    return groupByCategory(items, labelFor);
  }, [items, t]);

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: tCommon('all') },
    ...categories.map((category) => ({
      id: category,
      label: categoryLabel(category),
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
            {tHelp('contactSupport')}
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setFilter(tab.id)}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm font-medium capitalize transition-colors',
              filter === tab.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted text-muted-foreground hover:text-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className={cn('grid gap-4', loading && 'opacity-70')}>
        {sections.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center">
              <p className="text-foreground text-sm font-medium">
                {t('empty')}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                Try another filter or contact support.
              </p>
            </CardContent>
          </Card>
        ) : (
          sections.map((section) => (
            <Card key={section.category}>
              <CardHeader className="border-border border-b">
                <CardTitle>{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="pt-1">
                <Accordion className="w-full">
                  {section.items.map((item) => (
                    <AccordionItem key={item.id} value={`faq-${item.id}`}>
                      <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Card className="border-primary/20 bg-linear-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-foreground text-base font-semibold">
              {tHelp('stillNeedHelp')}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {tHelp('stillNeedHelpDesc')}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              nativeButton={false}
              render={<Link href="/help" />}
            >
              {tHelp('title')}
            </Button>
            <Button
              className="rounded-xl"
              nativeButton={false}
              render={<Link href="/contact" />}
            >
              {tHelp('contactSupport')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
