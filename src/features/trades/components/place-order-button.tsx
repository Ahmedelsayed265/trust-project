'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useFormContext } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { placeOrderAction } from '@/features/orders/actions/get-orders';
import type { OrderSummaryPreviewState } from '@/features/trades/hooks/use-order-summary-preview';
import { isQuoteAmountCurrency } from '@/features/trades/lib/trade-symbol';
import {
  parseAmount,
  type OrderFormValues,
} from '@/features/trades/schemas/order';
import { formatMoney } from '@/shared/trading';

export function PlaceOrderButton({
  preview,
  providerId,
  quoteAsset,
  disabled,
  disabledLabel,
  onPlaced,
}: {
  preview: OrderSummaryPreviewState;
  providerId: string | null;
  quoteAsset: string;
  disabled?: boolean;
  disabledLabel?: string;
  onPlaced?: () => void;
}) {
  const t = useTranslations('Trades');
  const tCommon = useTranslations('Common');
  const form = useFormContext<OrderFormValues>();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();
  const { summary, error, loading } = preview;
  const previewReady =
    Boolean(summary) && !loading && !error && (summary?.price ?? 0) > 0;

  function openReview() {
    void form.handleSubmit(() => {
      if (!providerId) {
        toast.error(t('toastConnectFirst'));
        return;
      }
      if (loading) {
        toast.error(t('toastWaitPreview'));
        return;
      }
      if (error) {
        toast.error(error);
        return;
      }
      if (!summary || summary.price <= 0) {
        toast.error(t('toastNoMarketPrice'));
        return;
      }
      setOpen(true);
    })();
  }

  function onConfirm() {
    if (!providerId || !previewReady || !summary) return;

    const values = form.getValues();
    const amount = parseAmount(values.amount);
    const limitPrice = parseAmount(values.limitPrice ?? '');
    const useQuote = isQuoteAmountCurrency(values.currency, quoteAsset);

    startTransition(async () => {
      const result = await placeOrderAction({
        provider_id: providerId,
        symbol: values.pair,
        side: values.side,
        type: values.orderType,
        quote_amount: useQuote ? amount : undefined,
        qty: useQuote ? undefined : amount,
        limit_price: values.orderType === 'limit' ? limitPrice : undefined,
      });

      if (!result.ok) {
        toast.error(result.message);
        return;
      }

      const order = result.data;
      toast.success(
        <span>
          {t('toastOrderPlaced', {
            symbol: order.display_symbol || order.symbol,
          })}{' '}
          <Link
            href={`/orders/${encodeURIComponent(order.id)}?provider_id=${encodeURIComponent(order.provider_id)}`}
            className="underline"
          >
            {t('viewOrder')}
          </Link>
        </span>,
      );
      setOpen(false);
      form.setValue('amount', '');
      form.setValue('percent', 0);
      onPlaced?.();
      router.refresh();
    });
  }

  return (
    <>
      <Button
        type="button"
        className="h-11 w-full rounded-xl"
        disabled={disabled || pending || !previewReady}
        onClick={openReview}
      >
        {disabledLabel ??
          (loading
            ? t('updatingPreview')
            : error
              ? t('previewUnavailable')
              : summary && summary.price <= 0
                ? t('noPriceAvailable')
                : t('reviewOrder'))}
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle>{t('confirmOrder')}</SheetTitle>
            <SheetDescription>{t('confirmDescription')}</SheetDescription>
          </SheetHeader>

          {summary ? (
            <div className="space-y-3 px-4 py-2 text-sm">
              <Row
                label={tCommon('pair')}
                value={summary.display_symbol || summary.symbol}
              />
              <Row
                label={tCommon('side')}
                value={summary.side.toUpperCase()}
                className={
                  summary.side === 'buy' ? 'text-success' : 'text-destructive'
                }
              />
              <Row
                label={tCommon('type')}
                value={
                  summary.type === 'limit'
                    ? tCommon('limit')
                    : tCommon('market')
                }
              />
              <Row label={tCommon('quantity')} value={summary.qty_label} />
              <Row
                label={tCommon('price')}
                value={formatMoney(summary.price, summary.currency)}
              />
              <Row
                label={t('feeWithRate', { rate: summary.fee_rate_pct })}
                value={formatMoney(summary.fee, summary.currency)}
              />
              <Row
                label={tCommon('total')}
                value={formatMoney(summary.total, summary.currency)}
                bold
              />
            </div>
          ) : null}

          <SheetFooter className="mt-auto gap-2 border-t px-4 py-4 sm:flex-row">
            <Button
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={() => setOpen(false)}
            >
              {tCommon('back')}
            </Button>
            <Button
              className="rounded-xl"
              disabled={pending || !previewReady}
              onClick={onConfirm}
            >
              {pending ? t('placing') : t('placeOrder')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}

function Row({
  label,
  value,
  className,
  bold,
}: {
  label: string;
  value: string;
  className?: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={[
          'text-foreground font-medium',
          bold ? 'text-base font-bold' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {value}
      </span>
    </div>
  );
}
