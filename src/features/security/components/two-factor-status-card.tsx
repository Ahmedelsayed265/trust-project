'use client';

import { useTranslations } from 'next-intl';
import { ShieldCheck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import type { SecurityOverview } from '@/features/security/types';
import { cn } from '@/lib/utils';

export function TwoFactorStatusCard({
  data,
  pending,
  onToggle,
}: {
  data: SecurityOverview;
  pending: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const t = useTranslations('Security');

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-2xl',
              data.two_factor_enabled
                ? 'text-success bg-emerald-50 dark:bg-emerald-950/40'
                : 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300',
            )}
          >
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <p className="text-muted-foreground text-sm">
              {t('twoFactorStatus')}
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
              {data.two_factor_label}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {data.last_verified_label
                ? t('lastVerified', { label: data.last_verified_label })
                : data.two_factor_enabled
                  ? t('protectionOn')
                  : t('addAuthenticator')}
            </p>
          </div>
        </div>
        <div className="border-border bg-background flex items-center gap-3 rounded-xl border px-3 py-2.5">
          <div className="min-w-0">
            <p className="text-foreground text-sm font-semibold">
              {t('twoFactorAuth')}
            </p>
            <p className="text-muted-foreground text-xs">{t('requireCode')}</p>
          </div>
          <Switch
            checked={data.two_factor_enabled}
            disabled={pending}
            onCheckedChange={onToggle}
            aria-label={t('toggle2faAria')}
          />
        </div>
      </CardContent>
    </Card>
  );
}
