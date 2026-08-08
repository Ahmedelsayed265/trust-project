'use client';

import { useTranslations } from 'next-intl';
import { createElement } from 'react';
import { BadgeCheck, Building2, FileText, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/shared/components/page-header';
import { useAppSettings } from '@/shared/providers/app-settings-provider';

export function AboutView() {
  const t = useTranslations('About');
  const settings = useAppSettings();

  const highlights = [
    {
      title: t('highlightAiTitle'),
      description: t('highlightAiDesc'),
      icon: BadgeCheck,
    },
    {
      title: t('highlightTradersTitle'),
      description: t('highlightTradersDesc'),
      icon: Building2,
    },
    {
      title: t('highlightUpdatesTitle'),
      description: t('highlightUpdatesDesc'),
      icon: FileText,
    },
  ];

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={t('title', { appName: settings.app_name })}
        description={t('description')}
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">
              {t('currentVersion')}
            </p>
            <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
              {t('versionLine', { appName: settings.app_name })}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              {t('releasedLine')}
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 w-fit border-0">
            {t('stable')}
          </Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-3">
        {highlights.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex-row items-start gap-3 space-y-0">
              <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                {createElement(item.icon, { className: 'size-5' })}
              </div>
              <div>
                <CardTitle className="text-base">{item.title}</CardTitle>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="border-border border-b">
          <div className="flex items-start gap-3">
            <div className="bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-xl">
              <Scale className="size-5" />
            </div>
            <div>
              <CardTitle>{t('legalTitle')}</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {t('legalDesc', { appName: settings.app_name })}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            [t('company'), `${settings.app_name} Markets Ltd.`],
            [t('support'), settings.support_email],
            [t('website'), 'trustai.app'],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border-border bg-background rounded-xl border px-3 py-3"
            >
              <p className="text-muted-foreground text-xs">{label}</p>
              <p className="text-foreground mt-1 text-sm font-semibold">
                {value}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
