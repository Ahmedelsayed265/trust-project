'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { OrderSummaryPreviewState } from '@/features/trades/hooks/use-order-summary-preview';
import { formatMoney } from '@/shared/trading';
import { cn } from '@/lib/utils';

export function OrderSummary({
  preview,
}: {
  preview: OrderSummaryPreviewState;
}) {
  const t = useTranslations('Trades');
  const tCommon = useTranslations('Common');
  const { summary, error, loading } = preview;

  const rows = summary
    ? [
        {
          label: tCommon('pair'),
          value: summary.display_symbol || summary.symbol,
        },
        {
          label: t('orderType'),
          value:
            summary.type === 'limit' ? tCommon('limit') : tCommon('market'),
        },
        {
          label: t('side'),
          value: summary.side.toUpperCase(),
          className:
            summary.side === 'buy' ? 'text-success' : 'text-destructive',
        },
        {
          label: t('estQuantity'),
          value: summary.qty_label,
        },
        {
          label: t('estPrice'),
          value: formatMoney(summary.price, summary.currency),
        },
        {
          label: t('subtotal'),
          value: formatMoney(summary.subtotal, summary.currency),
        },
        {
          label: t('feeWithRate', { rate: summary.fee_rate_pct }),
          value: formatMoney(summary.fee, summary.currency),
        },
        {
          label: t('estTotal'),
          value: formatMoney(summary.total, summary.currency),
          bold: true,
        },
        {
          label: t('buyingPower'),
          value: formatMoney(summary.buying_power, summary.currency),
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{t('orderSummary')}</span>
          {loading ? (
            <span className="text-muted-foreground text-xs font-normal">
              {tCommon('updating')}
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 pt-0">
        {!summary && !error ? (
          <p className="text-muted-foreground py-4 text-sm">
            {t('enterAmountPreview')}
          </p>
        ) : null}

        {error ? (
          <p className="text-destructive py-4 text-sm">{error}</p>
        ) : null}

        {rows.map((row, index) => (
          <div key={row.label}>
            {index === rows.length - 1 ? <Separator className="my-2" /> : null}
            <div className="flex items-center justify-between gap-3 py-2 text-sm">
              <span className="text-muted-foreground">{row.label}</span>
              <span
                className={cn(
                  'text-foreground font-medium',
                  row.bold && 'text-base font-bold',
                  row.className,
                )}
              >
                {row.value}
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
