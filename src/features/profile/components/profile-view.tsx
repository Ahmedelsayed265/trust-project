import { getTranslations } from 'next-intl/server';
import { ProfileHero } from '@/features/profile/components/profile-hero';
import { ProfileAccountOverview } from '@/features/profile/components/profile-account-overview';
import { ProfileSettingsGrid } from '@/features/profile/components/profile-settings-grid';
import type { HomeAccount, HomePortfolio } from '@/features/dashboard/types';

type ProfileViewProps = {
  portfolio: HomePortfolio | null;
  accounts: HomeAccount[];
};

export async function ProfileView({ portfolio, accounts }: ProfileViewProps) {
  const t = await getTranslations('Profile');

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div>
        <h1 className="text-foreground text-xl font-bold tracking-tight sm:text-2xl">
          {t('title')}
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">{t('description')}</p>
      </div>

      <ProfileHero />
      <ProfileAccountOverview portfolio={portfolio} accounts={accounts} />
      <ProfileSettingsGrid />
    </div>
  );
}
