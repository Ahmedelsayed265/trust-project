'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrderCard } from '@/features/orders/components/order-card';
import { OrdersSummary } from '@/features/orders/components/orders-summary';
import { RecentFills } from '@/features/orders/components/recent-fills';
import { useOrders } from '@/features/orders/hooks/use-orders';
import type { OrderFill, OrdersData } from '@/features/orders/types';
import { cn } from '@/lib/utils';

type Tab = 'open' | 'history' | 'trades';

export function OrdersView({
  initialData,
  initialFills,
}: {
  initialData: OrdersData;
  initialFills: OrderFill[];
}) {
  const t = useTranslations('Orders');
  const [tab, setTab] = useState<Tab>('open');
  const [showSearch, setShowSearch] = useState(false);
  const {
    data,
    query,
    setQuery,
    openOrders,
    historyOrders,
    fills,
    markCancelled,
  } = useOrders(initialData, initialFills);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'open', label: t('openOrdersTab', { count: openOrders.length }) },
    { id: 'history', label: t('orderHistory') },
    { id: 'trades', label: t('tradeHistory') },
  ];

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            {t('title')}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {t('description')}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="rounded-xl"
          aria-label={t('searchAria')}
          onClick={() => setShowSearch((value) => !value)}
        >
          <Search />
        </Button>
      </div>

      {showSearch ? (
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('searchPlaceholder')}
          className="bg-card h-10 rounded-xl"
        />
      ) : null}

      <div className="flex scrollbar-none gap-2 overflow-x-auto overscroll-x-contain pb-0.5">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors',
              tab === item.id
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground ring-border hover:bg-muted hover:text-foreground ring-1',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <OrdersSummary summary={data.summary} />

      {tab === 'open' ? (
        <section className="space-y-3">
          <h2 className="text-foreground text-base font-semibold">
            {t('summaryOpenOrders')}
          </h2>
          {openOrders.length === 0 ? (
            <CardEmpty message={t('noOpenOrders')} />
          ) : (
            <div className="space-y-3">
              {openOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onCancelled={markCancelled}
                />
              ))}
            </div>
          )}
          <RecentFills
            fills={fills.slice(0, 5)}
            onViewAll={() => setTab('trades')}
          />
        </section>
      ) : null}

      {tab === 'history' ? (
        <section className="space-y-3">
          <h2 className="text-foreground text-base font-semibold">
            {t('orderHistory')}
          </h2>
          {historyOrders.length === 0 ? (
            <CardEmpty message={t('noOrderHistory')} />
          ) : (
            <div className="space-y-3">
              {historyOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          )}
        </section>
      ) : null}

      {tab === 'trades' ? (
        <RecentFills fills={fills} title={t('tradeHistory')} />
      ) : null}
    </div>
  );
}

function CardEmpty({ message }: { message: string }) {
  return (
    <div className="border-border bg-card text-muted-foreground rounded-lg border border-dashed px-4 py-10 text-center text-sm">
      {message}
    </div>
  );
}
