'use client';

import { useLocale, useTranslations } from 'next-intl';
import {
  Bell,
  CircleHelp,
  HelpCircle,
  History,
  Languages,
  Link2,
  LogOut,
  Palette,
  Shield,
  SlidersHorizontal,
  User,
  UserPlus,
  Info,
  BadgeCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteAccountCard } from '@/features/profile/components/delete-account-card';
import { SettingsLink } from '@/features/profile/components/settings-link';

export function ProfileSettingsGrid() {
  const t = useTranslations('Profile');
  const tCommon = useTranslations('Common');
  const tLocale = useTranslations('LocaleSwitcher');
  const locale = useLocale();

  const languageLabel =
    locale === 'en' || locale === 'ar' || locale === 'es'
      ? tLocale(locale)
      : locale;

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <div className="space-y-4">
        <SettingsCard
          title={t('sectionAccount')}
          items={[
            {
              label: t('personalInfo'),
              description: t('personalInfoDesc'),
              icon: User,
              href: '/settings',
            },
            {
              label: t('verification'),
              description: t('verificationDesc'),
              icon: BadgeCheck,
              badge: tCommon('verified'),
              badgeTone: 'success',
              href: '/profile/verification',
            },
            {
              label: t('security'),
              description: t('securityDesc'),
              icon: Shield,
              href: '/profile/security',
            },
          ]}
        />
        <SettingsCard
          title={t('sectionTrading')}
          items={[
            {
              label: t('connectedAccounts'),
              description: t('connectedAccountsDesc'),
              icon: Link2,
              href: '/accounts',
            },
            {
              label: t('tradingPreferences'),
              description: t('tradingPreferencesDesc'),
              icon: SlidersHorizontal,
              href: '/settings',
            },
            {
              label: t('orderTradeHistory'),
              description: t('orderTradeHistoryDesc'),
              icon: History,
              href: '/orders',
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <SettingsCard
          title={t('sectionPreferences')}
          items={[
            {
              label: t('language'),
              description: languageLabel,
              icon: Languages,
              href: '/settings',
            },
            {
              label: t('appearance'),
              description: t('appearanceLight'),
              icon: Palette,
              href: '/settings',
            },
            {
              label: t('notifications'),
              description: t('notificationsDesc'),
              icon: Bell,
              href: '/settings',
            },
          ]}
        />
        <SettingsCard
          title={t('sectionSupport')}
          items={[
            {
              label: t('helpCenter'),
              description: t('helpCenterDesc'),
              icon: CircleHelp,
              href: '/help',
            },
            {
              label: t('faqs'),
              description: t('faqsDesc'),
              icon: HelpCircle,
              href: '/faq',
            },
            {
              label: t('chatAi'),
              description: t('chatAiDesc'),
              icon: Sparkles,
              badge: tCommon('new'),
              badgeTone: 'primary',
              href: '/ai-chat',
            },
          ]}
        />
      </div>

      <div className="space-y-4">
        <SettingsCard
          title={t('sectionOther')}
          items={[
            {
              label: t('inviteFriends'),
              description: t('inviteFriendsDesc'),
              icon: UserPlus,
              badge: t('rewardsBadge'),
              badgeTone: 'success',
              href: '/invite',
            },
            {
              label: t('aboutTrustAi'),
              description: t('aboutVersion'),
              icon: Info,
              href: '/about',
            },
            {
              label: t('logOut'),
              description: t('logOutDesc'),
              icon: LogOut,
              action: 'logout',
            },
          ]}
        />

        <Card className="border-destructive/30 bg-destructive/5 dark:bg-destructive/10">
          <CardHeader>
            <CardTitle className="text-destructive">
              {t('dangerZone')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DeleteAccountCard />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SettingsCard({
  title,
  items,
}: {
  title: string;
  items: React.ComponentProps<typeof SettingsLink>['item'][];
}) {
  return (
    <Card className="">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-0.5 pt-0">
        {items.map((item) => (
          <SettingsLink key={item.label} item={item} />
        ))}
      </CardContent>
    </Card>
  );
}
