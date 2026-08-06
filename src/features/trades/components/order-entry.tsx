'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import { Sparkline } from '@/shared/components/sparkline';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import { cn } from '@/lib/utils';
import {
  BTC_PRICE,
  estimateQuantity,
  formatQty,
  type OrderFormValues,
} from '@/features/trades/schemas/order';
import { formatMoney, useTrading } from '@/shared/trading';

const percents = [25, 50, 75, 100] as const;
const priceData = [40, 42, 38, 45, 48, 46, 52, 55, 58, 62, 65];

export function OrderEntry({ onReview }: { onReview?: () => void }) {
  const form = useFormContext<OrderFormValues>();
  const { snapshot, activeProvider, supports } = useTrading();
  const amount = form.watch('amount');
  const side = form.watch('side');
  const orderType = form.watch('orderType');
  const percent = form.watch('percent');
  const qty = estimateQuantity(amount);
  const buyingPower = snapshot?.buyingPower ?? 0;
  const currency = snapshot?.currency ?? 'USDT';
  const canTrade = supports('marketOrders') || supports('limitOrders');

  function applyPercent(value: number) {
    form.setValue('percent', value);
    form.setValue('amount', ((buyingPower * value) / 100).toFixed(2), {
      shouldValidate: true,
    });
  }

  return (
    <Card className="">
      <CardHeader className="border-b [.border-b]:pb-4">
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-orange-100 text-sm font-bold text-orange-600 dark:bg-orange-950/40 dark:text-orange-300">
              ₿
            </div>
            <div>
              <CardTitle className="text-base">BTC/USDT</CardTitle>
              <p className="text-muted-foreground text-xs">Bitcoin</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-foreground text-sm font-semibold">
              ${BTC_PRICE.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
            <ChangeIndicator value="+1.25%" className="text-xs" />
          </div>
        </div>
        <Sparkline
          data={priceData}
          className="mt-2 h-8 w-full"
          fill
          strokeWidth={1.75}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-foreground mb-2 text-sm font-medium">Order Type</p>
          <div className="bg-muted grid grid-cols-2 gap-2 rounded-xl p-1">
            {(['market', 'limit'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => form.setValue('orderType', type)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold capitalize transition-colors',
                  orderType === type
                    ? 'bg-card text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-foreground mb-2 text-sm font-medium">Side</p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => form.setValue('side', 'buy')}
              className={cn(
                'rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-colors',
                side === 'buy'
                  ? 'border-success text-success bg-emerald-50 dark:bg-emerald-950/30'
                  : 'border-border text-muted-foreground hover:border-success/50',
              )}
            >
              Buy
            </button>
            <button
              type="button"
              onClick={() => form.setValue('side', 'sell')}
              className={cn(
                'rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition-colors',
                side === 'sell'
                  ? 'border-destructive text-destructive bg-red-50 dark:bg-red-950/30'
                  : 'border-border text-muted-foreground hover:border-destructive/50',
              )}
            >
              Sell
            </button>
          </div>
        </div>

        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <FieldContent>
                <div className="relative flex items-center">
                  <Input
                    {...field}
                    id="amount"
                    inputMode="decimal"
                    className="bg-background h-11 rounded-xl pr-20 text-sm"
                    placeholder="0.00"
                  />
                  <button
                    type="button"
                    className="border-border bg-muted text-foreground absolute right-1.5 inline-flex h-8 items-center gap-1 rounded-lg border px-2.5 text-xs font-semibold"
                  >
                    USDT
                    <ChevronDown className="text-muted-foreground size-3.5" />
                  </button>
                </div>
                {fieldState.error && (
                  <FieldError>{fieldState.error.message}</FieldError>
                )}
              </FieldContent>
            </Field>
          )}
        />

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">Amount %</span>
            <span className="text-muted-foreground">{percent}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={percent}
            onChange={(e) => {
              applyPercent(Number(e.target.value));
            }}
            className="bg-muted accent-primary h-2 w-full cursor-pointer appearance-none rounded-full"
          />
          <div className="mt-2 flex justify-between gap-2">
            {percents.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => applyPercent(p)}
                className={cn(
                  'flex-1 rounded-lg border px-2 py-1.5 text-xs font-semibold transition-colors',
                  percent === p
                    ? 'border-primary bg-accent text-primary'
                    : 'border-border text-muted-foreground hover:bg-muted',
                )}
              >
                {p}%
              </button>
            ))}
          </div>
          <p className="text-muted-foreground mt-2 text-xs">
            Buying power from {activeProvider.displayName}:{' '}
            {formatMoney(buyingPower, currency)}
          </p>
        </div>

        <div className="bg-muted/60 rounded-xl px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">Estimated Quantity: </span>
          <span className="text-foreground font-semibold">
            {formatQty(qty)} BTC
          </span>
        </div>

        <Button
          type="button"
          className="h-11 w-full rounded-xl"
          disabled={!canTrade || !snapshot}
          onClick={() => {
            void form.handleSubmit(() => onReview?.())();
          }}
        >
          {!snapshot
            ? 'Connect provider to trade'
            : !canTrade
              ? 'Trading not supported'
              : 'Review Order'}
        </Button>
      </CardContent>
    </Card>
  );
}
