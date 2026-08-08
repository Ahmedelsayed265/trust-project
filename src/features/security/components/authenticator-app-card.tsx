'use client';

import { useTranslations } from 'next-intl';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SecurityOverview } from '@/features/security/types';

export function AuthenticatorAppCard({
  data,
  pending,
  onEnable,
  onDisable,
}: {
  data: SecurityOverview;
  pending: boolean;
  onEnable: () => void;
  onDisable: () => void;
}) {
  const t = useTranslations('Security');

  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex items-start gap-3">
          <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Smartphone className="size-5" />
          </div>
          <div>
            <CardTitle>{t('authenticatorApp')}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('authenticatorDesc')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border-border bg-muted/40 rounded-xl border px-3 py-3 text-sm">
          <p className="text-muted-foreground">{t('recoveryCodesLeft')}</p>
          <p className="text-foreground mt-1 font-semibold">
            {data.two_factor_enabled
              ? t('codesRemaining', { count: data.recovery_codes_left })
              : t('enableToGenerate')}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.two_factor_enabled ? (
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={pending}
              onClick={onDisable}
            >
              {t('disable2fa')}
            </Button>
          ) : (
            <Button
              type="button"
              className="rounded-xl"
              disabled={pending}
              onClick={onEnable}
            >
              {pending ? t('starting') : t('enable2fa')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
