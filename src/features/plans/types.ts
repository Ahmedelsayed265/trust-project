export type PlanAction = 'downgrade' | 'current' | 'upgrade';

export type PlanFeature = {
  key: string;
  label: string;
  included: boolean;
  note: string | null;
};

export type Plan = {
  id: number;
  key: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  price_monthly: number;
  price_yearly: number;
  currency: string;
  icon: string;
  tier: number;
  is_popular: boolean;
  is_current: boolean;
  action: PlanAction | string;
  features: PlanFeature[];
};

export type PlanComparisonRow = {
  key: string;
  label: string;
  values: Record<string, boolean>;
};

export type PlansData = {
  plans: Plan[];
  current_plan: Plan | null;
  comparison: PlanComparisonRow[];
};

export type SubscriptionStatus = 'active' | 'cancelled' | 'expired' | string;

export type Subscription = {
  id: number;
  plan_id: number;
  plan_key: string;
  plan_name: string;
  description: string;
  status: SubscriptionStatus;
  is_usable: boolean;
  billing_cycle: 'monthly' | 'yearly' | string;
  price: number;
  currency: string;
  auto_renew: boolean;
  started_at: string;
  renews_at: string | null;
  renews_at_label: string | null;
  ends_at: string | null;
  cancelled_at: string | null;
};

export type MySubscriptionData = {
  subscription: Subscription | null;
  history: Subscription[];
};

export type BillingCycle = 'monthly' | 'yearly';

export type SubscribePlanInput = {
  plan_key: string;
  billing_cycle: BillingCycle;
  auto_renew?: boolean;
};
