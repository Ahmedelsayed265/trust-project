'use client';

import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { previewOrderSummaryAction } from '@/features/orders/actions/get-orders';
import type { OrderSummaryPreview } from '@/features/orders/types';
import {
  parseAmount,
  type OrderFormValues,
} from '@/features/trades/schemas/order';
import { isQuoteAmountCurrency } from '@/features/trades/lib/trade-symbol';

const DEBOUNCE_MS = 300;

export type OrderSummaryPreviewState = {
  summary: OrderSummaryPreview | null;
  error: string | null;
  loading: boolean;
};

export function useOrderSummaryPreview(options: {
  providerId: string | null;
  quoteAsset: string;
}): OrderSummaryPreviewState {
  const form = useFormContext<OrderFormValues>();
  const values = form.watch();

  const [summary, setSummary] = useState<OrderSummaryPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const amount = parseAmount(values.amount);
  const limitPrice = parseAmount(values.limitPrice ?? '');
  const canPreview =
    Boolean(options.providerId) &&
    amount > 0 &&
    !(values.orderType === 'limit' && limitPrice <= 0);

  useEffect(() => {
    if (!canPreview || !options.providerId) {
      setSummary(null);
      setError(null);
      setLoading(false);
      return;
    }

    let active = true;
    const useQuote = isQuoteAmountCurrency(values.currency, options.quoteAsset);

    const timer = window.setTimeout(() => {
      if (!active) return;

      setLoading(true);

      void previewOrderSummaryAction({
        provider_id: options.providerId ?? undefined,
        symbol: values.pair,
        side: values.side,
        type: values.orderType,
        quote_amount: useQuote ? amount : undefined,
        qty: useQuote ? undefined : amount,
        limit_price: values.orderType === 'limit' ? limitPrice : undefined,
      }).then((result) => {
        if (!active) return;

        if (!result.ok) {
          setSummary(null);
          setError(result.message);
          setLoading(false);
          return;
        }

        if (result.data.price <= 0) {
          setSummary(result.data);
          setError(
            `No live price for ${result.data.display_symbol || result.data.symbol} on this account.`,
          );
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
    amount,
    canPreview,
    limitPrice,
    options.providerId,
    options.quoteAsset,
    values.currency,
    values.orderType,
    values.pair,
    values.side,
  ]);

  if (!canPreview) {
    return { summary: null, error: null, loading: false };
  }

  return { summary, error, loading };
}
