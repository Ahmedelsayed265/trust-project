'use client';

import { createElement } from 'react';
import { BadgeCheck, Building2, FileText, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/shared/components/page-header';
import { useAppSettings } from '@/shared/providers/app-settings-provider';

const highlights = [
  {
    title: 'AI-first trading',
    description:
      'TrustAI combines market data with model-driven signals to help you act with more confidence.',
    icon: BadgeCheck,
  },
  {
    title: 'Built for active traders',
    description:
      'Portfolio tracking, provider balances, and order history stay in one place so you can move faster.',
    icon: Building2,
  },
  {
    title: 'Transparent product updates',
    description:
      'We ship improvements continuously and document major changes in Help Center release notes.',
    icon: FileText,
  },
];

export function AboutView() {
  const settings = useAppSettings();

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader
        title={`About ${settings.app_name}`}
        description="Learn more about the product, version, and company details."
      />

      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-muted-foreground text-sm">Current version</p>
            <p className="text-foreground mt-1 text-2xl font-bold tracking-tight">
              {settings.app_name} 1.0.0
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
              AI Trading Platform · Released March 2026
            </p>
          </div>
          <Badge className="bg-primary/10 text-primary hover:bg-primary/10 w-fit border-0">
            Stable
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
              <CardTitle>Legal & compliance</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                {settings.app_name} provides market tools and AI insights.
                Trading involves risk and past performance is not a guarantee of
                future results.
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {[
            ['Company', `${settings.app_name} Markets Ltd.`],
            ['Support', settings.support_email],
            ['Website', 'trustai.app'],
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
