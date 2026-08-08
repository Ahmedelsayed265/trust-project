'use client';

import { useTranslations } from 'next-intl';
import type { SecurityOverview } from '@/features/security/types';
import { ChangePasswordForm } from '@/features/security/components/change-password-form';
import { RecentActivityCard } from '@/features/security/components/recent-activity-card';
import { SessionsCard } from '@/features/security/components/sessions-card';
import { TwoFactorSection } from '@/features/security/components/two-factor-section';
import { PageHeader } from '@/shared/components/page-header';

export function SecurityView({ data }: { data: SecurityOverview }) {
  const t = useTranslations('Security');

  return (
    <div className="flex w-full min-w-0 flex-col gap-4 sm:gap-5">
      <PageHeader title={t('title')} description={t('description')} />

      <TwoFactorSection data={data} />

      <div className="grid gap-4 lg:grid-cols-2">
        <ChangePasswordForm passwordChangedAt={data.password_changed_at} />
        <SessionsCard sessions={data.sessions} />
      </div>

      <RecentActivityCard activity={data.recent_activity} />
    </div>
  );
}
