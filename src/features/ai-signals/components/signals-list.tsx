'use client';

import { useTranslations } from 'next-intl';
import { Card, CardContent } from '@/components/ui/card';
import { SignalCard } from '@/features/ai-signals/components/signal-card';
import type { Signal } from '@/features/ai-signals/types';

export function SignalsList({ items }: { items: Signal[] }) {
  const t = useTranslations('AiSignals');

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-foreground text-sm font-medium">{t('empty')}</p>
          <p className="text-muted-foreground mt-1 text-sm">{t('emptyHint')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((signal) => (
        <SignalCard key={signal.id} signal={signal} />
      ))}
    </div>
  );
}
