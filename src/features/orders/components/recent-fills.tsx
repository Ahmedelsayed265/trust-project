'use client';

import { useTranslations } from 'next-intl';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  AssetIcon,
  SideBadge,
} from '@/features/orders/components/order-badges';
import {
  formatOrderDate,
  formatOrderPrice,
  formatOrderQty,
} from '@/features/orders/lib/order-display';
import type { OrderFill } from '@/features/orders/types';
import { formatMoney } from '@/shared/trading';

export function RecentFills({
  fills,
  onViewAll,
  title,
}: {
  fills: OrderFill[];
  onViewAll?: () => void;
  title?: string;
}) {
  const t = useTranslations('Orders');
  const tCommon = useTranslations('Common');
  const heading = title ?? t('recentFills');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{heading}</CardTitle>
        {onViewAll ? (
          <CardAction>
            <button
              type="button"
              className="text-primary text-sm font-medium hover:underline"
              onClick={onViewAll}
            >
              {tCommon('viewAll')}
            </button>
          </CardAction>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-1">
        {fills.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {t('noFills')}
          </p>
        ) : (
          <>
            <div className="border-border text-muted-foreground hidden grid-cols-[1.4fr_0.7fr_1fr_1fr_1fr_1fr] gap-3 border-b px-1 pb-2 text-xs font-medium md:grid">
              <span>{t('colAsset')}</span>
              <span>{tCommon('side')}</span>
              <span>{t('amount')}</span>
              <span>{t('price')}</span>
              <span>{t('fee')}</span>
              <span className="text-right">{t('colTime')}</span>
            </div>

            {fills.map((fill) => (
              <div
                key={fill.id}
                className="hover:bg-muted/40 flex flex-col gap-2 rounded-xl px-1 py-3 transition-colors md:grid md:grid-cols-[1.4fr_0.7fr_1fr_1fr_1fr_1fr] md:items-center md:gap-3"
              >
                <div className="flex items-center gap-2.5">
                  <AssetIcon
                    symbol={fill.symbol}
                    displaySymbol={fill.display_symbol}
                  />
                  <div>
                    <p className="text-foreground text-sm font-semibold">
                      {fill.display_symbol || fill.symbol}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {fill.account}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:block">
                  <span className="text-muted-foreground text-xs md:hidden">
                    {tCommon('side')}
                  </span>
                  <SideBadge side={fill.side} />
                </div>

                <div className="flex items-center justify-between md:block">
                  <span className="text-muted-foreground text-xs md:hidden">
                    {t('amount')}
                  </span>
                  <p className="text-foreground text-sm font-medium">
                    {formatOrderQty(fill.qty)}
                  </p>
                </div>

                <div className="flex items-center justify-between md:block">
                  <span className="text-muted-foreground text-xs md:hidden">
                    {t('price')}
                  </span>
                  <p className="text-foreground text-sm font-medium">
                    {formatOrderPrice(fill.price)}
                  </p>
                </div>

                <div className="flex items-center justify-between md:block">
                  <span className="text-muted-foreground text-xs md:hidden">
                    {t('fee')}
                  </span>
                  <p className="text-muted-foreground text-sm">
                    {formatMoney(fill.fee)} {fill.fee_asset}
                  </p>
                </div>

                <div className="flex items-center justify-between md:justify-end">
                  <span className="text-muted-foreground text-xs md:hidden">
                    {t('colTime')}
                  </span>
                  <p className="text-muted-foreground text-xs md:text-sm">
                    {formatOrderDate(fill.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </>
        )}
      </CardContent>
    </Card>
  );
}
