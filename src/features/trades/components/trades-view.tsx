'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { History, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  orderSchema,
  type OrderFormValues,
} from '@/features/trades/schemas/order';
import { AccountSummary } from '@/features/trades/components/account-summary';
import { OrderEntry } from '@/features/trades/components/order-entry';
import { OrderSummary } from '@/features/trades/components/order-summary';
import { TradeAiSignal } from '@/features/trades/components/trade-ai-signal';
import { OpenPositions } from '@/features/trades/components/open-positions';
import { useOrderSummaryPreview } from '@/features/trades/hooks/use-order-summary-preview';

function TradeOrderPanel() {
  const preview = useOrderSummaryPreview();

  return (
    <div className="grid gap-4 lg:gap-5 xl:grid-cols-3">
      <OrderEntry preview={preview} />
      <div className="flex flex-col gap-4">
        <OrderSummary preview={preview} />
        <TradeAiSignal />
      </div>
      <OpenPositions />
    </div>
  );
}

export function TradesView() {
  const [tab, setTab] = useState<'trade' | 'positions'>('trade');

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      pair: 'BTC/USDT',
      orderType: 'market',
      side: 'buy',
      amount: '1000',
      currency: 'USDT',
      percent: 0,
      limitPrice: '',
    },
  });

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
            Trades
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Place new trades and manage your positions.
          </p>
        </div>
        <Button
          variant="outline"
          className="w-full rounded-xl sm:w-auto"
          render={<Link href="/orders" />}
        >
          <History />
          Trade History
        </Button>
      </div>

      <AccountSummary />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="bg-muted flex items-center gap-1 rounded-xl p-1">
          {(['trade', 'positions'] as const).map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-sm font-semibold capitalize transition-colors',
                tab === item
                  ? 'bg-card text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="rounded-xl">
            All Accounts
            <ChevronDown />
          </Button>
          <Button size="icon" className="rounded-xl" aria-label="New trade">
            <Plus />
          </Button>
        </div>
      </div>

      <FormProvider {...form}>
        {tab === 'trade' ? (
          <TradeOrderPanel />
        ) : (
          <div className="mx-auto w-full max-w-xl">
            <OpenPositions />
          </div>
        )}
      </FormProvider>
    </div>
  );
}
