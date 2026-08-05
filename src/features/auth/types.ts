export type UserPlan = {
  id: number;
  plan_id: number;
  key: string;
  name: string;
  status: string;
  billing_cycle: string;
  price: number;
  currency: string;
  renews_at: string;
  renews_at_label: string;
  auto_renew: boolean;
};

export type UserProfile = {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
  initials: string;
  email: string;
  email_verified: boolean;
  phone: string | null;
  avatar: string | null;
  country: string | null;
  status: string;
  language: string;
  currency: string;
  timezone: string | null;
  email_alerts: boolean;
  push_alerts: boolean;
  ai_digest: boolean;
  two_factor_enabled: boolean;
  password_changed_at: string | null;
  kyc_status: string | null;
  kyc_level: string | null;
  kyc_verified: boolean;
  kyc_verified_at: string | null;
  referral_code: string;
  referral_link: string;
  member_since: string;
  member_since_label: string;
  last_login_at: string | null;
  created_at: string;
  plan: UserPlan | null;
  has_active_subscription: boolean;
  unread_notifications: number;
  connected_providers: string[];
};

export type AuthUser = UserProfile & {
  auth: string;
  token: string;
};

export type ApiSuccessResponse<T> = {
  message: string;
  code: number;
  data: T;
};

export type RegisterApiResponse = ApiSuccessResponse<AuthUser>;
export type LoginApiResponse = ApiSuccessResponse<AuthUser>;
export type LogoutApiResponse = ApiSuccessResponse<null>;
export type ProfileApiResponse = ApiSuccessResponse<UserProfile>;
