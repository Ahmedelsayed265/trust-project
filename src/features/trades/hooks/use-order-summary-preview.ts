'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { previewOrderSummaryAction } from '@/features/orders/actions/get-orders';
import type { OrderSummaryPreview } from '@/features/orders/types';
import {
  parseAmount,
  type OrderFormValues,
} from '@/features/trades/schemas/order';
import { useTrading } from '@/shared/trading';

const DEBOUNCE_MS = 300;

export type OrderSummaryPreviewState = {
  summary: OrderSummaryPreview | null;
  error: string | null;
  loading: boolean;
};

export function useOrderSummaryPreview(): OrderSummaryPreviewState {
  const form = useFormContext<OrderFormValues>();
  const { activeProviderId } = useTrading();
  const values = form.watch();

  const [summary, setSummary] = useState<OrderSummaryPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const amount = parseAmount(values.amount);
  const limitPrice = parseAmount(values.limitPrice ?? '');

  useEffect(() => {
    if (amount <= 0) {
      setSummary(null);
      setError(null);
      setLoading(false);
      return;
    }

    if (values.orderType === 'limit' && limitPrice <= 0) {
      setSummary(null);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    setLoading(true);

    const timer = window.setTimeout(() => {
      void previewOrderSummaryAction({
        provider_id: activeProviderId,
        symbol: values.pair,
        side: values.side,
        type: values.orderType,
        quote_amount: values.currency === 'USDT' ? amount : undefined,
        qty: values.currency === 'BTC' ? amount : undefined,
        limit_price: values.orderType === 'limit' ? limitPrice : undefined,
      }).then((result) => {
        if (!active) return;

        if (!result.ok) {
          setSummary(null);
          setError(result.message);
          setLoading(false);
          return;
        }

        setSummary(result.data);
        setError(null);
        setLoading(false);
      });
    }, DEBOUNCE_MS);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    activeProviderId,
    amount,
    limitPrice,
    values.currency,
    values.orderType,
    values.pair,
    values.side,
  ]);

  return { summary, error, loading };
}
