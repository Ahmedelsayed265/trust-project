'use client';

import { useTranslations } from 'next-intl';
import { Gift } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import type { ReferralStats } from '@/features/invite/types';
import { formatMoney } from '@/shared/trading/format';

type InviteStatsCardProps = {
  stats: ReferralStats;
  sharedBy: string;
};

export function InviteStatsCard({ stats, sharedBy }: InviteStatsCardProps) {
  const t = useTranslations('Invite');
  const currency = stats.currency || 'USD';

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-slate-900">
      <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-12 shrink-0 items-center justify-center rounded-2xl">
            <Gift className="size-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">
              {t('referralTotal')}
            </p>
            <p className="text-foreground mt-1 text-3xl font-bold tracking-tight">
              {formatMoney(stats.total_earned, currency)}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {stats.rewarded === 1
                ? t('friendRewardedOne', { name: sharedBy })
                : t('friendsRewarded', {
                    count: stats.rewarded,
                    name: sharedBy,
                  })}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:min-w-[220px]">
          <div className="border-border/70 bg-background/80 rounded-xl border px-3 py-2.5">
            <p className="text-muted-foreground text-xs">{t('invitesSent')}</p>
            <p className="text-foreground mt-1 text-lg font-bold">
              {stats.invites_sent}
            </p>
          </div>
          <div className="border-border/70 bg-background/80 rounded-xl border px-3 py-2.5">
            <p className="text-muted-foreground text-xs">{t('joined')}</p>
            <p className="text-foreground mt-1 text-lg font-bold">
              {stats.joined}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
