export type SecuritySession = {
  id: number;
  name: string;
  device_name: string;
  device_type: string;
  ip_address: string | null;
  is_current: boolean;
  last_used_at: string | null;
  last_used_label: string | null;
  created_at: string;
};

export type SecurityActivity = {
  id: number;
  event: string;
  description: string;
  ip_address: string | null;
  device: string | null;
  location: string | null;
  time: string;
  created_at: string;
};

export type SecurityOverview = {
  two_factor_enabled: boolean;
  two_factor_confirmed_at: string | null;
  two_factor_label: string;
  last_verified_label: string | null;
  password_changed_at: string | null;
  recovery_codes_left: number;
  sessions: SecuritySession[];
  recent_activity: SecurityActivity[];
};

export type TwoFactorEnableData = {
  secret: string;
  provisioning_uri: string;
  manual_entry_key: string;
};

export type TwoFactorConfirmData = {
  recovery_codes: string[];
};
