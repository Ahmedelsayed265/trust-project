'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { isBuySide } from '@/features/ai-signals/lib/signal-display';
import type { Signal } from '@/features/ai-signals/types';
import { cn } from '@/lib/utils';

export function TradeAiSignal({
  signal,
  onApply,
}: {
  signal: Signal | null;
  onApply?: (signal: Signal) => void;
}) {
  const t = useTranslations('Trades');
  const tCommon = useTranslations('Common');
  const tSignals = useTranslations('AiSignals');

  if (!signal) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t('aiSignal')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground text-sm">{t('noActiveSignal')}</p>
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/ai-signals" />}
          >
            {t('browseSignals')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  const buy = isBuySide(signal.side);
  const strengthKey =
    signal.strength === 'strong'
      ? 'strengthStrong'
      : signal.strength === 'moderate'
        ? 'strengthModerate'
        : signal.strength === 'watch'
          ? 'strengthWatch'
          : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('aiSignal')}</CardTitle>
        <CardAction>
          <span className="text-muted-foreground text-xs">
            {signal.updated_label
              ? t('signalUpdated', { label: signal.updated_label })
              : tSignals('statusActive')}
          </span>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex size-14 flex-col items-center justify-center rounded-xl',
              buy
                ? 'bg-emerald-50 dark:bg-emerald-950/40'
                : 'bg-red-50 dark:bg-red-950/40',
            )}
          >
            {buy ? (
              <ArrowUpRight className="text-success size-5" strokeWidth={2.5} />
            ) : (
              <ArrowDownRight
                className="text-destructive size-5"
                strokeWidth={2.5}
              />
            )}
            <span
              className={cn(
                'text-xs font-bold uppercase',
                buy ? 'text-success' : 'text-destructive',
              )}
            >
              {signal.side}
            </span>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground text-base font-bold uppercase">
                {signal.side}
              </span>
              <Badge
                className={cn(
                  'border-0 capitalize',
                  signal.strength === 'strong'
                    ? 'text-success bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40'
                    : 'bg-muted text-muted-foreground',
                )}
              >
                {strengthKey ? tSignals(strengthKey) : String(signal.strength)}
              </Badge>
            </div>
            <p className="text-muted-foreground text-sm">
              {signal.display_symbol || signal.symbol}
              {signal.timeframe ? ` · ${signal.timeframe}` : ''}
            </p>
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {tCommon('confidence')}
            </span>
            <span className="text-foreground font-semibold">
              {Math.round(signal.confidence)}%
            </span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${Math.max(0, Math.min(100, signal.confidence))}%`,
              }}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {onApply ? (
            <Button
              className="rounded-xl"
              onClick={() => onApply(signal)}
              disabled={signal.is_locked}
            >
              {t('applyToOrder')}
            </Button>
          ) : null}
          <Button
            variant="outline"
            className="rounded-xl"
            render={<Link href="/ai-signals" />}
          >
            {t('viewSignals')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
