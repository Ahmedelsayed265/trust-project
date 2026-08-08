import { getTranslations } from 'next-intl/server';
import {
  getSignalsAction,
  getSignalsStatsAction,
} from '@/features/ai-signals/actions/get-signals';
import { AiSignalsView } from '@/features/ai-signals';

export default async function AiSignalsPage() {
  const t = await getTranslations('AiSignals');
  const [listResult, statsResult] = await Promise.all([
    getSignalsAction({ status: 'active', per_page: 20 }),
    getSignalsStatsAction(),
  ]);

  if (!listResult.ok) {
    return (
      <div className="border-border bg-card rounded-lg border px-4 py-10 text-center">
        <p className="text-foreground text-sm font-medium">{t('loadError')}</p>
        <p className="text-muted-foreground mt-1 text-sm">
          {listResult.message}
        </p>
      </div>
    );
  }

  const stats = statsResult.ok
    ? statsResult.data
    : (listResult.data.stats ?? {
        active_signals: 0,
        avg_confidence: 0,
        win_rate_30d: 0,
        closed_30d: 0,
        strong_signals: 0,
      });

  return <AiSignalsView initialData={listResult.data} initialStats={stats} />;
}
