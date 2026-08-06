'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import Link from 'next/link';
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
import {
  FAQ_CATEGORY_LABELS,
  type FaqItem,
  type FaqsData,
} from '@/features/faq/types';
import { cn } from '@/lib/utils';

type Filter = 'all' | string;

function groupByCategory(items: FaqItem[]) {
  const groups = new Map<string, FaqItem[]>();

  for (const item of items) {
    const key = item.category || 'general';
    const list = groups.get(key) ?? [];
    list.push(item);
    groups.set(key, list);
  }

  return [...groups.entries()].map(([category, faqs]) => ({
    category,
    title: FAQ_CATEGORY_LABELS[category] ?? category,
    items: faqs,
  }));
}

export function FaqView({ initialData }: { initialData: FaqsData }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [items, setItems] = useState(initialData.items);
  const [categories, setCategories] = useState(initialData.categories);
  const [loading, startLoad] = useTransition();

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

  const sections = useMemo(() => groupByCategory(items), [items]);

  const tabs: { id: Filter; label: string }[] = [
    { id: 'all', label: 'All' },
    ...categories.map((category) => ({
      id: category,
      label: FAQ_CATEGORY_LABELS[category] ?? category,
    })),
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title="FAQs"
        description="Answers about connecting providers, trading, and account security."
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
                No FAQs in this category
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
              Still need help?
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              Browse guides in Help Center or send us a message.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              nativeButton={false}
              render={<Link href="/help" />}
            >
              Help Center
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
