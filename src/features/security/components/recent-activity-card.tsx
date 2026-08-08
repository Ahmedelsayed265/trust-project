'use client';

import { useTranslations } from 'next-intl';
import { Activity, LogIn, LogOut, Shield } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SecurityActivity } from '@/features/security/types';

function ActivityIcon({ event }: { event: string }) {
  if (event === 'logout') return <LogOut className="size-4" />;
  if (event === 'login') return <LogIn className="size-4" />;
  return <Shield className="size-4" />;
}

export function RecentActivityCard({
  activity,
}: {
  activity: SecurityActivity[];
}) {
  const t = useTranslations('Security');

  return (
    <Card>
      <CardHeader className="border-border border-b">
        <div className="flex items-start gap-3">
          <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
            <Activity className="size-5" />
          </div>
          <div>
            <CardTitle>{t('recentActivityTitle')}</CardTitle>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('recentActivityDesc')}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-1 pt-1">
        {activity.length === 0 ? (
          <p className="text-muted-foreground px-2 py-6 text-center text-sm">
            {t('noRecentActivity')}
          </p>
        ) : (
          activity.map((item) => (
            <div
              key={item.id}
              className="hover:bg-muted/40 flex items-start gap-3 rounded-xl px-2 py-3"
            >
              <div className="bg-muted text-muted-foreground mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg">
                <ActivityIcon event={item.event} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-foreground text-sm font-semibold">
                    {item.description}
                  </p>
                  <p className="text-muted-foreground text-xs">{item.time}</p>
                </div>
                <p className="text-muted-foreground mt-0.5 text-xs">
                  {[item.device, item.ip_address, item.location]
                    .filter(Boolean)
                    .join(' · ') || t('unknownDevice')}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
