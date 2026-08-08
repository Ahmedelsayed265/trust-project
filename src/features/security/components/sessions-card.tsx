'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Laptop, MonitorSmartphone, Smartphone, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  revokeOtherSessionsAction,
  revokeSessionAction,
} from '@/features/security/actions/sessions';
import type { SecuritySession } from '@/features/security/types';
import { cn } from '@/lib/utils';

function DeviceIcon({ type }: { type: string }) {
  if (type === 'mobile') return <Smartphone className="size-4" />;
  if (type === 'tablet') return <MonitorSmartphone className="size-4" />;
  return <Laptop className="size-4" />;
}

export function SessionsCard({ sessions }: { sessions: SecuritySession[] }) {
  const t = useTranslations('Security');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const otherCount = sessions.filter((session) => !session.is_current).length;

  function revokeOthers() {
    startTransition(async () => {
      const result = await revokeOtherSessionsAction();
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(t('toastSignedOutOthers'));
      router.refresh();
    });
  }

  function revokeOne(sessionId: number) {
    startTransition(async () => {
      const result = await revokeSessionAction(sessionId);
      if (!result.ok) {
        toast.error(result.message);
        return;
      }
      toast.success(t('toastSessionRevoked'));
      router.refresh();
    });
  }

  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <CardTitle>{t('sessionsTitle')}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('sessionsDesc')}
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl"
            disabled={pending || otherCount === 0}
            onClick={revokeOthers}
          >
            {t('signOutOthers')}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-1">
        {sessions.length === 0 ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">
            {t('noSessions')}
          </p>
        ) : (
          sessions.map((session) => (
            <div
              key={session.id}
              className="hover:bg-muted/40 flex items-start justify-between gap-3 rounded-xl px-2 py-3"
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="bg-muted text-muted-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                  <DeviceIcon type={session.device_type} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-foreground text-sm font-semibold">
                      {session.device_name || session.name}
                    </p>
                    {session.is_current ? (
                      <Badge className="text-success border-0 bg-emerald-50 hover:bg-emerald-50 dark:bg-emerald-950/40">
                        {tCommon('current')}
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mt-0.5 text-xs">
                    {session.ip_address ?? t('unknownIp')}
                    {session.last_used_label
                      ? ` · ${session.last_used_label}`
                      : ` · ${t('neverUsed')}`}
                  </p>
                </div>
              </div>
              {!session.is_current ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className={cn(
                    'text-muted-foreground hover:text-destructive size-8 shrink-0 rounded-lg',
                  )}
                  disabled={pending}
                  aria-label={t('revokeAria', {
                    name: session.device_name || session.name,
                  })}
                  onClick={() => revokeOne(session.id)}
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : null}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
