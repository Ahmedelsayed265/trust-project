'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChangeIndicator } from '@/shared/components/change-indicator';
import { baseAsset } from '@/features/portfolio/lib/portfolio-data';
import type { PortfolioPosition } from '@/features/portfolio/types';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';
import { cn } from '@/lib/utils';

export function OpenPositions({
  positions,
  currency = 'USD',
  onSelectSymbol,
}: {
  positions: PortfolioPosition[];
  currency?: string;
  onSelectSymbol?: (symbol: string) => void;
}) {
  const t = useTranslations('Trades');
  const tCommon = useTranslations('Common');

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('openPositions', { count: positions.length })}</CardTitle>
        <CardAction>
          <Link
            href="/portfolio"
            className="text-primary text-sm font-medium hover:underline"
          >
            {tCommon('viewAll')}
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-1">
        {positions.length === 0 ? (
          <p className="text-muted-foreground py-6 text-center text-sm">
            {t('noOpenPositions')}
          </p>
        ) : (
          positions.map((position) => {
            const asset = baseAsset(position.symbol);
            return (
              <button
                key={position.id}
                type="button"
                onClick={() => onSelectSymbol?.(position.symbol)}
                className="hover:bg-muted/50 flex w-full items-center gap-3 rounded-xl px-1 py-2.5 text-left transition-colors"
              >
                <div className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                  {asset.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-foreground text-sm font-semibold">
                    {position.display_symbol || position.symbol}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {position.qty} {asset}
                    <span className="capitalize"> · {position.side}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-foreground text-sm font-semibold">
                    {formatMoney(position.market_value, currency)}
                  </p>
                  <ChangeIndicator
                    value={`${formatSignedMoney(position.unrealized_pnl, currency)} / ${formatPct(position.unrealized_pnl_pct)}`}
                    positive={position.is_positive}
                    className={cn('text-xs')}
                  />
                </div>
              </button>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
