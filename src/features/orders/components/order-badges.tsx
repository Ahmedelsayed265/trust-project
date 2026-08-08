'use client';

import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import {
  isCanceledStatus,
  orderAssetLabel,
  statusLabel,
} from '@/features/orders/lib/order-display';
import type { OrderSide, OrderStatus } from '@/features/orders/types';

export function SideBadge({ side }: { side: OrderSide }) {
  const tCommon = useTranslations('Common');

  return (
    <span
      className={cn(
        'inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-semibold capitalize',
        side === 'buy'
          ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
          : 'text-destructive bg-red-50 dark:bg-red-950/40',
      )}
    >
      {side === 'buy' ? tCommon('buy') : tCommon('sell')}
    </span>
  );
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  const t = useTranslations('Orders');
  const normalized = String(status).toLowerCase();

  const label =
    normalized === 'new' || normalized === 'pending'
      ? t('status.open')
      : normalized === 'partially_filled'
        ? t('status.partiallyFilled')
        : normalized === 'filled'
          ? t('status.filled')
          : isCanceledStatus(status)
            ? t('status.canceled')
            : normalized === 'rejected'
              ? t('status.rejected')
              : statusLabel(status);

  return (
    <span
      className={cn(
        'inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
        (normalized === 'new' || normalized === 'pending') &&
          'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
        normalized === 'partially_filled' &&
          'bg-sky-50 text-sky-600 dark:bg-sky-950/40 dark:text-sky-300',
        normalized === 'filled' &&
          'text-success bg-emerald-50 dark:bg-emerald-950/40',
        isCanceledStatus(status) && 'bg-muted text-muted-foreground',
        normalized === 'rejected' && 'bg-destructive/10 text-destructive',
      )}
    >
      {label}
    </span>
  );
}

export function AssetIcon({
  symbol,
  displaySymbol,
}: {
  symbol: string;
  displaySymbol?: string;
}) {
  return (
    <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold">
      {orderAssetLabel(displaySymbol || symbol)}
    </div>
  );
}
