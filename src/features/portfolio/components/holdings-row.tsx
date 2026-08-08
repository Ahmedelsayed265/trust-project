'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowLeftRight } from 'lucide-react';
import { Sparkline } from '@/shared/components/sparkline';
import { cn } from '@/lib/utils';
import { formatMoney, formatPct, formatSignedMoney } from '@/shared/trading';
import {
  assetTone,
  formatQty,
  type Holding,
} from '@/features/portfolio/lib/portfolio-data';

export function HoldingsRow({
  holding,
  currency,
}: {
  holding: Holding;
  currency: string;
}) {
  const t = useTranslations('Portfolio');
  const tCommon = useTranslations('Common');
  const positive = holding.positive;

  return (
    <tr className="border-border/70 hover:bg-muted/40 border-b transition-colors last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              'flex size-9 shrink-0 items-center justify-center rounded-full text-xs font-bold',
              assetTone(holding.asset),
            )}
          >
            {holding.asset.slice(0, 3)}
          </span>
          <div className="min-w-0">
            <p className="text-foreground text-sm font-semibold">
              {holding.symbol}
            </p>
            <p className="text-muted-foreground text-xs capitalize">
              {holding.kind === 'cash'
                ? t('freeBalance')
                : t('positionKind', { side: holding.side ?? 'Long' })}
            </p>
          </div>
        </div>
      </td>

      <td className="text-foreground px-4 py-3 text-right text-sm">
        {formatQty(holding.qty)}
      </td>

      <td className="text-muted-foreground px-4 py-3 text-right text-sm">
        {holding.avgEntryPrice != null
          ? formatMoney(holding.avgEntryPrice, currency)
          : '—'}
      </td>

      <td className="text-foreground px-4 py-3 text-right text-sm">
        {holding.markPrice != null
          ? formatMoney(holding.markPrice, currency)
          : '—'}
      </td>

      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="bg-muted h-1.5 w-20 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${Math.min(holding.allocation * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-muted-foreground text-xs font-medium">
            {(holding.allocation * 100).toFixed(1)}%
          </span>
        </div>
      </td>

      <td className="text-foreground px-4 py-3 text-right text-sm font-semibold">
        {formatMoney(holding.value, currency)}
      </td>

      <td className="px-4 py-3 text-right">
        {holding.kind === 'cash' ? (
          <span className="text-muted-foreground text-sm">—</span>
        ) : (
          <>
            <p
              className={cn(
                'text-sm font-semibold',
                positive ? 'text-success' : 'text-destructive',
              )}
            >
              {formatSignedMoney(holding.pnl, currency)}
            </p>
            <p
              className={cn(
                'text-xs',
                positive ? 'text-success/80' : 'text-destructive/80',
              )}
            >
              {formatPct(holding.pnlPct)}
            </p>
          </>
        )}
      </td>

      <td className="px-4 py-3">
        <Sparkline
          data={holding.series}
          positive={positive}
          className="h-8 w-20"
          strokeWidth={1.75}
        />
      </td>

      <td className="px-4 py-3">
        <Link
          href={`/trades?symbol=${encodeURIComponent(holding.symbol)}`}
          className="text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors"
        >
          <ArrowLeftRight className="size-3.5" />
          {tCommon('trade')}
        </Link>
      </td>
    </tr>
  );
}
