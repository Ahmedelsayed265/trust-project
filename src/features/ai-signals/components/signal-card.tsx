'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ArrowDownRight, ArrowUpRight, Lock, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ASSET_ICON_BG,
  isBuySide,
} from '@/features/ai-signals/lib/signal-display';
import type { Signal } from '@/features/ai-signals/types';
import { cn } from '@/lib/utils';
import { formatMoney } from '@/shared/trading';

export function SignalCard({ signal }: { signal: Signal }) {
  const t = useTranslations('AiSignals');
  const tCommon = useTranslations('Common');
  const buy = isBuySide(signal.side);
  const locked = signal.is_locked;
  const planName =
    signal.required_plan_key === 'signal-guard-plus'
      ? t('planSignalGuardPlus')
      : signal.required_plan_key === 'market-intel-pro'
        ? t('planMarketIntelPro')
        : signal.required_plan_key === 'signal-guard'
          ? t('planSignalGuard')
          : null;
  const strengthText =
    signal.strength === 'strong'
      ? t('strengthStrong')
      : signal.strength === 'moderate'
        ? t('strengthModerate')
        : signal.strength === 'watch'
          ? t('strengthWatch')
          : signal.strength;
  const iconBg =
    ASSET_ICON_BG[signal.asset_class] ??
    (buy
      ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
      : 'text-destructive bg-red-50 dark:bg-red-950/40');

  return (
    <Card>
      <CardHeader>
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-xl text-lg font-bold',
              iconBg,
            )}
          >
            {signal.icon_label ?? (buy ? '↑' : '↓')}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-base">
                {signal.display_symbol || signal.symbol}
              </CardTitle>
              <Badge
                className={cn(
                  'border-0 uppercase',
                  buy
                    ? 'text-success bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-destructive bg-red-50 hover:bg-red-50 dark:bg-red-950/40',
                )}
              >
                {buy ? (
                  <ArrowUpRight className="size-3" />
                ) : (
                  <ArrowDownRight className="size-3" />
                )}
                {buy ? tCommon('buy') : tCommon('sell')}
              </Badge>
            </div>
            <p className="text-muted-foreground text-xs">
              {signal.name}
              {signal.updated_label
                ? ` · ${t('updated', { label: signal.updated_label })}`
                : null}
              {signal.timeframe ? ` · ${signal.timeframe}` : null}
            </p>
          </div>
        </div>
        <CardAction className="flex flex-col items-end gap-1">
          <Badge
            className={cn(
              'border-0 capitalize',
              signal.strength === 'strong'
                ? 'text-success bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40'
                : signal.strength === 'watch'
                  ? 'text-muted-foreground bg-muted hover:bg-muted'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-50 dark:bg-amber-950/40 dark:text-amber-300',
            )}
          >
            {strengthText}
          </Badge>
          {signal.status !== 'active' && (
            <span className="text-muted-foreground text-right text-[11px] capitalize">
              {signal.status}
              {signal.outcome ? ` · ${signal.outcome}` : null}
              {signal.result_pct != null
                ? ` · ${signal.result_pct > 0 ? '+' : ''}${signal.result_pct}%`
                : null}
            </span>
          )}
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t('spotPrice')}</span>
          <span className="text-foreground font-semibold">
            {formatMoney(signal.price)}
          </span>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground flex items-center gap-1">
              <Sparkles className="size-3.5" />
              {tCommon('confidence')}
            </span>
            <span className="text-foreground font-semibold">
              {signal.confidence}%
            </span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{
                width: `${Math.min(100, Math.max(0, signal.confidence))}%`,
              }}
            />
          </div>
        </div>
        {locked ? (
          <Button
            variant="outline"
            className="h-9 w-full rounded-xl"
            render={<Link href="/profile/plans" />}
          >
            <Lock className="size-3.5" />
            {planName
              ? t('unlockWithPlan', { plan: planName })
              : t('upgradeUnlock')}
          </Button>
        ) : (
          <Button
            variant="outline"
            className="h-9 w-full rounded-xl"
            render={<Link href="/trades" />}
          >
            {t('actOnSignal')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
