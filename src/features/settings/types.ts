export type SettingsOption = {
  value: string;
  label: string;
};

export type UserSettings = {
  display_name: string;
  email: string;
  language: string;
  currency: string;
  timezone: string;
  email_alerts: boolean;
  push_alerts: boolean;
  ai_digest: boolean;
  options: {
    languages: SettingsOption[];
    currencies: SettingsOption[];
  };
};

export type UpdateUserSettingsInput = {
  display_name: string;
  language: string;
  currency: string;
  email_alerts: boolean;
  push_alerts: boolean;
  ai_digest: boolean;
};

export type UpdateUserProfileInput = {
  first_name: string;
  last_name: string;
  phone: string;
  country: string;
};
