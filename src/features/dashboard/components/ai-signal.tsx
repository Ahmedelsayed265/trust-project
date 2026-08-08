import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { isBuySide } from '@/features/ai-signals/lib/signal-display';
import type { Signal } from '@/features/ai-signals/types';
import { cn } from '@/lib/utils';

type AISignalProps = {
  signal: Signal | null;
};

function strengthKey(strength: string) {
  if (strength === 'strong') return 'strengthStrong' as const;
  if (strength === 'moderate') return 'strengthModerate' as const;
  if (strength === 'watch') return 'strengthWatch' as const;
  return null;
}

export async function AISignal({ signal }: AISignalProps) {
  const t = await getTranslations('Dashboard');
  const tCommon = await getTranslations('Common');
  const tSignals = await getTranslations('AiSignals');

  if (!signal) {
    return (
      <div className="border-border bg-card flex h-full flex-col rounded-lg border p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground text-base font-semibold">
            {t('aiSignal')}
          </h2>
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-muted-foreground text-sm">{t('noTopSignal')}</p>
          <Link
            href="/ai-signals"
            className="text-primary text-sm font-medium hover:underline"
          >
            {t('browseSignals')}
          </Link>
        </div>
      </div>
    );
  }

  const buy = isBuySide(signal.side);
  const confidence = Math.max(0, Math.min(100, signal.confidence));
  const strength = strengthKey(signal.strength);
  const strengthText = strength ? tSignals(strength) : signal.strength;

  return (
    <div className="border-border bg-card flex h-full flex-col rounded-lg border p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-foreground text-base font-semibold">
          {t('aiSignal')}
        </h2>
        <span className="text-muted-foreground text-xs">
          {signal.updated_label
            ? t('updated', { label: signal.updated_label })
            : tCommon('live')}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4">
        <div
          className={cn(
            'flex size-20 items-center justify-center rounded-2xl',
            buy
              ? 'bg-emerald-50 dark:bg-emerald-950/40'
              : 'bg-red-50 dark:bg-red-950/40',
          )}
        >
          <div className="flex flex-col items-center">
            {buy ? (
              <ArrowUpRight className="text-success size-7" strokeWidth={2.5} />
            ) : (
              <ArrowDownRight
                className="text-destructive size-7"
                strokeWidth={2.5}
              />
            )}
            <span
              className={cn(
                'mt-0.5 text-lg font-bold tracking-wide uppercase',
                buy ? 'text-success' : 'text-destructive',
              )}
            >
              {signal.side}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-foreground text-base font-bold">
            {signal.display_symbol || signal.symbol}
          </span>
          <span
            className={cn(
              'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize',
              signal.strength === 'strong'
                ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
                : signal.strength === 'watch'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                  : 'bg-muted text-muted-foreground',
            )}
          >
            {t('strengthSignal', { strength: strengthText })}
          </span>
        </div>

        <div className="w-full">
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('aiConfidence')}</span>
            <span className="text-foreground font-semibold">{confidence}%</span>
          </div>
          <div className="bg-muted h-2 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{ width: `${confidence}%` }}
            />
          </div>
        </div>

        <Link
          href="/ai-signals"
          className="text-primary text-sm font-medium hover:underline"
        >
          {t('viewDetails')}
        </Link>
      </div>
    </div>
  );
}
