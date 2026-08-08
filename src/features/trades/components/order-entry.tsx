'use client';

import { useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useFormContext, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkline } from '@/shared/components/sparkline';
import { PlaceOrderButton } from '@/features/trades/components/place-order-button';
import type { OrderSummaryPreviewState } from '@/features/trades/hooks/use-order-summary-preview';
import type { OrderFormValues } from '@/features/trades/schemas/order';
import type { MarketSymbol } from '@/features/markets/types';
import { formatMoney } from '@/shared/trading';
import { cn } from '@/lib/utils';

const percents = [25, 50, 75, 100] as const;

export function OrderEntry({
  preview,
  markets,
  market,
  providerId,
  buyingPower,
  focusToken = 0,
  onSymbolChange,
  onPlaced,
}: {
  preview: OrderSummaryPreviewState;
  markets: MarketSymbol[];
  market: MarketSymbol | null;
  providerId: string | null;
  buyingPower: number;
  focusToken?: number;
  onSymbolChange: (symbol: string) => void;
  onPlaced?: () => void;
}) {
  const t = useTranslations('Trades');
  const tCommon = useTranslations('Common');
  const tValidation = useTranslations('Validation');
  const form = useFormContext<OrderFormValues>();
  const { summary } = preview;
  const side = form.watch('side');
  const orderType = form.watch('orderType');
  const percent = form.watch('percent');
  const currency = form.watch('currency');
  const pair = form.watch('pair');

  useEffect(() => {
    if (!focusToken) return;
    const input = document.getElementById('amount');
    if (input instanceof HTMLInputElement) {
      window.setTimeout(() => {
        input.focus();
        input.select();
      }, 180);
    }
  }, [focusToken]);

  const quoteAsset = market?.quote_asset ?? summary?.currency ?? 'USDT';
  const baseAsset = market?.base_asset ?? 'BTC';
  const displayCurrency = summary?.currency ?? quoteAsset;
  const power = summary?.buying_power ?? buyingPower;
  const displayPrice =
    summary?.market_price ?? summary?.price ?? market?.price ?? null;
  const sparkline =
    market?.sparkline?.length && market.sparkline.length > 1
      ? market.sparkline
      : [40, 42, 38, 45, 48, 46, 52, 55, 58, 62, 65];

  const marketItems = useMemo(
    () =>
      markets.map((item) => ({
        value: item.symbol,
        label: item.display_symbol || item.symbol,
      })),
    [markets],
  );

  const currencyItems = [
    { value: quoteAsset, label: quoteAsset },
    { value: baseAsset, label: baseAsset },
  ];

  function applyPercent(value: number) {
    form.setValue('percent', value);
    const quoteNotional = (power * value) / 100;
    const useQuote = currency.toUpperCase() === quoteAsset.toUpperCase();
    const nextAmount =
      useQuote || !displayPrice || displayPrice <= 0
        ? quoteNotional
        : quoteNotional / displayPrice;
    form.setValue('amount', nextAmount.toFixed(useQuote ? 2 : 6), {
      shouldValidate: true,
    });
  }

  const marketMatchesProvider =
    !market || !providerId || market.provider_id === providerId;
  const canTrade = Boolean(
    providerId && market?.is_tradable !== false && marketMatchesProvider,
  );

  return (
    <Card>
      <CardHeader className="border-b [.border-b]:pb-4">
        <div className="flex w-full items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
              {(market?.icon_label || summary?.display_symbol || pair).slice(
                0,
                2,
              )}
            </div>
            <div className="min-w-0 flex-1">
              {markets.length > 0 ? (
                <Controller
                  control={form.control}
                  name="pair"
                  render={({ field }) => (
                    <Select
                      value={field.value}
                      onValueChange={(value) => {
                        if (!value) return;
                        field.onChange(value);
                        onSymbolChange(value);
                      }}
                      items={marketItems}
                    >
                      <SelectTrigger className="bg-background h-10 w-full min-w-0 rounded-[12px]! px-2.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="start" alignItemWithTrigger={false}>
                        {markets.map((item) => (
                          <SelectItem key={item.symbol} value={item.symbol}>
                            {item.display_symbol || item.symbol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              ) : (
                <CardTitle className="text-base">
                  {summary?.display_symbol || pair}
                </CardTitle>
              )}
              <p className="text-muted-foreground mt-1 text-xs">
                {market?.name ??
                  (markets.length === 0
                    ? t('noTradableMarkets')
                    : tValidation('selectMarket'))}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-foreground text-sm font-semibold">
              {displayPrice != null
                ? formatMoney(displayPrice, displayCurrency)
                : '—'}
            </p>
            {market ? (
              <p
                className={cn(
                  'text-xs font-semibold',
                  market.is_positive ? 'text-success' : 'text-destructive',
                )}
              >
                {market.change_24h_pct >= 0 ? '+' : ''}
                {market.change_24h_pct.toFixed(2)}%
              </p>
            ) : null}
          </div>
        </div>
        <Sparkline
          data={sparkline}
          className="mt-2 h-8 w-full"
          fill
          strokeWidth={1.75}
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-foreground mb-2 text-sm font-medium">
            {t('orderType')}
          </p>
          <div className="bg-muted grid grid-cols-2 gap-2 rounded-xl p-1">
            {(['market', 'limit'] as const).map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => form.setValue('orderType', type)}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm font-semibold transition-colors',
                  orderType === type
                    ? 'bg-card text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {type === 'market' ? tCommon('market') : tCommon('limit')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-foreground mb-2 text-sm font-medium">
            {t('side')}
          </p>
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
              {tCommon('buy')}
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
              {tCommon('sell')}
            </button>
          </div>
        </div>

        {orderType === 'limit' ? (
          <Controller
            control={form.control}
            name="limitPrice"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid || undefined}>
                <FieldLabel htmlFor="limitPrice">{t('limitPrice')}</FieldLabel>
                <FieldContent>
                  <Input
                    {...field}
                    id="limitPrice"
                    inputMode="decimal"
                    className="bg-background h-11 rounded-[12px]! text-sm"
                    placeholder="0.00"
                  />
                  {fieldState.error ? (
                    <FieldError>{fieldState.error.message}</FieldError>
                  ) : null}
                </FieldContent>
              </Field>
            )}
          />
        ) : null}

        <Controller
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid || undefined}>
              <FieldLabel htmlFor="amount">{t('amount')}</FieldLabel>
              <FieldContent>
                <div className="relative flex items-center">
                  <Input
                    {...field}
                    id="amount"
                    inputMode="decimal"
                    className="bg-background h-11 rounded-[12px]! pr-24 text-sm"
                    placeholder="0.00"
                  />
                  <div className="absolute right-1.5">
                    <Controller
                      control={form.control}
                      name="currency"
                      render={({ field: currencyField }) => (
                        <Select
                          value={currencyField.value}
                          onValueChange={(value) => {
                            if (value) currencyField.onChange(value);
                          }}
                          items={currencyItems}
                        >
                          <SelectTrigger className="bg-muted h-8 w-auto min-w-20 rounded-lg border px-2 text-xs font-semibold">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent
                            align="end"
                            alignItemWithTrigger={false}
                          >
                            {currencyItems.map((item) => (
                              <SelectItem key={item.value} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                {fieldState.error ? (
                  <FieldError>{fieldState.error.message}</FieldError>
                ) : null}
              </FieldContent>
            </Field>
          )}
        />

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-foreground font-medium">
              {t('amountPercent')}
            </span>
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
            {t('buyingPower')}: {formatMoney(power, displayCurrency)}
            {currency !== quoteAsset
              ? ` · ${t('amountIn', { currency })}`
              : ` · ${t('quoteAsset', { asset: quoteAsset })}`}
          </p>
        </div>

        <div className="bg-muted/60 rounded-xl px-3 py-2.5 text-sm">
          <span className="text-muted-foreground">
            {t('estimatedQuantity')}{' '}
          </span>
          <span className="text-foreground font-semibold">
            {summary?.qty_label ?? '—'}
          </span>
        </div>

        <PlaceOrderButton
          preview={preview}
          providerId={providerId}
          quoteAsset={quoteAsset}
          disabled={!canTrade}
          disabledLabel={
            !providerId
              ? t('connectToTrade')
              : !market
                ? tValidation('selectMarket')
                : !marketMatchesProvider
                  ? t('switchAccountForMarket')
                  : undefined
          }
          onPlaced={onPlaced}
        />
      </CardContent>
    </Card>
  );
}
