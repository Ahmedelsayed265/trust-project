'use client';

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
  const { summary, error, loading } = preview;

  const rows = summary
    ? [
        { label: 'Pair', value: summary.display_symbol || summary.symbol },
        {
          label: 'Order Type',
          value: summary.type === 'limit' ? 'Limit' : 'Market',
        },
        {
          label: 'Side',
          value: summary.side.toUpperCase(),
          className:
            summary.side === 'buy' ? 'text-success' : 'text-destructive',
        },
        {
          label: 'Est. Quantity',
          value: summary.qty_label,
        },
        {
          label: 'Est. Price',
          value: formatMoney(summary.price, summary.currency),
        },
        {
          label: 'Subtotal',
          value: formatMoney(summary.subtotal, summary.currency),
        },
        {
          label: `Fee (${summary.fee_rate_pct}%)`,
          value: formatMoney(summary.fee, summary.currency),
        },
        {
          label: 'Est. Total',
          value: formatMoney(summary.total, summary.currency),
          bold: true,
        },
        {
          label: 'Buying Power',
          value: formatMoney(summary.buying_power, summary.currency),
        },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>Order Summary</span>
          {loading ? (
            <span className="text-muted-foreground text-xs font-normal">
              Updating…
            </span>
          ) : null}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-0 pt-0">
        {!summary && !error ? (
          <p className="text-muted-foreground py-4 text-sm">
            Enter an amount to preview fees and totals.
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
