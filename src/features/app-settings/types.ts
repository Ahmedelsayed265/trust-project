export type AppSocialLinks = {
  facebook: string | null;
  twitter: string | null;
  instagram: string | null;
  linkedin: string | null;
  telegram: string | null;
};

export type AppStoreLinks = {
  android_url: string | null;
  ios_url: string | null;
  min_android_version: string | null;
  min_ios_version: string | null;
};

export type AppReferralRewards = {
  inviter_reward: number;
  invitee_reward: number;
};

export type AppLocaleOption = {
  value: string;
  label: string;
};

export type AppSettings = {
  app_name: string;
  support_email: string;
  support_phone: string | null;
  whatsapp: string | null;
  social: AppSocialLinks;
  apps: AppStoreLinks;
  maintenance_mode: boolean;
  maintenance_message: string | null;
  referral: AppReferralRewards;
  locales: AppLocaleOption[];
  currencies: string[];
  trading_mode: string;
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  app_name: 'TrustAI',
  support_email: 'support@trustai.app',
  support_phone: null,
  whatsapp: null,
  social: {
    facebook: null,
    twitter: null,
    instagram: null,
    linkedin: null,
    telegram: null,
  },
  apps: {
    android_url: null,
    ios_url: null,
    min_android_version: null,
    min_ios_version: null,
  },
  maintenance_mode: false,
  maintenance_message: null,
  referral: {
    inviter_reward: 25,
    invitee_reward: 15,
  },
  locales: [
    { value: 'en', label: 'English' },
    { value: 'ar', label: 'العربية' },
    { value: 'es', label: 'Español' },
  ],
  currencies: ['USD', 'EUR', 'SAR'],
  trading_mode: 'demo',
};
