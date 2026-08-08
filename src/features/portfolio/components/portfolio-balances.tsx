'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/shared/trading';
import { assetTone, formatQty } from '@/features/portfolio/lib/portfolio-data';
import type { PortfolioBalancesData } from '@/features/portfolio/types';

export function PortfolioBalances({
  balances,
  providerLabel,
}: {
  balances: PortfolioBalancesData | null;
  providerLabel: string | null;
}) {
  const t = useTranslations('Portfolio');
  const rows = balances?.balances ?? [];
  const currency = balances?.currency ?? 'USD';
  const lockedValue = rows.reduce((sum, balance) => {
    const usd = balance.usd_value ?? 0;
    return (
      sum + (balance.total > 0 ? (balance.locked / balance.total) * usd : 0)
    );
  }, 0);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>{t('balances')}</CardTitle>
        {providerLabel && (
          <Badge variant="secondary" className="border-0">
            {providerLabel}
          </Badge>
        )}
      </CardHeader>

      <CardContent className="space-y-3">
        {rows.length === 0 ? (
          <p className="text-muted-foreground text-sm">{t('noBalances')}</p>
        ) : (
          <>
            <ul className="space-y-2.5">
              {rows.map((balance) => (
                <li
                  key={balance.asset}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                        assetTone(balance.asset),
                      )}
                    >
                      {balance.asset.slice(0, 3)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-sm font-semibold">
                        {balance.asset}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {t('freeAmount', { qty: formatQty(balance.free) })}
                        {balance.locked > 0
                          ? ` · ${t('lockedAmount', { qty: formatQty(balance.locked) })}`
                          : ''}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-foreground text-sm font-semibold">
                      {balance.usd_value != null
                        ? formatMoney(balance.usd_value, currency)
                        : '—'}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {t('totalAmount', { qty: formatQty(balance.total) })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="text-muted-foreground border-border border-t pt-3 text-xs">
              {lockedValue > 0
                ? t('reservedByOrders', {
                    amount: formatMoney(lockedValue, currency),
                  })
                : t('nothingReserved')}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
