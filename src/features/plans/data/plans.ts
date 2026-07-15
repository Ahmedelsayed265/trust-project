import { Shield, Star, Gem, type LucideIcon } from "lucide-react";

export type PlanId = "signal-guard" | "signal-guard-plus" | "market-intel-pro";

export type Plan = {
  id: PlanId;
  name: string;
  tagline: string;
  price: number;
  icon: LucideIcon;
  popular?: boolean;
  current?: boolean;
  action: "downgrade" | "current" | "upgrade";
};

export const plans: Plan[] = [
  {
    id: "signal-guard",
    name: "Signal Guard",
    tagline: "Essential AI alerts for focused day trading.",
    price: 29,
    icon: Shield,
    action: "downgrade",
  },
  {
    id: "signal-guard-plus",
    name: "Signal Guard Plus",
    tagline: "Advanced signals with smart risk controls.",
    price: 59,
    icon: Star,
    popular: true,
    current: true,
    action: "current",
  },
  {
    id: "market-intel-pro",
    name: "Market Intelligence Pro",
    tagline: "Full intelligence suite for serious traders.",
    price: 99,
    icon: Gem,
    action: "upgrade",
  },
];

export const comparisonRows: {
  feature: string;
  values: Record<PlanId, boolean>;
}[] = [
  {
    feature: "AI Signal",
    values: {
      "signal-guard": true,
      "signal-guard-plus": true,
      "market-intel-pro": true,
    },
  },
  {
    feature: "Deterministic Risk Rules",
    values: {
      "signal-guard": false,
      "signal-guard-plus": true,
      "market-intel-pro": true,
    },
  },
  {
    feature: "Chatbot Assistant",
    values: {
      "signal-guard": false,
      "signal-guard-plus": true,
      "market-intel-pro": true,
    },
  },
  {
    feature: "User Memory",
    values: {
      "signal-guard": false,
      "signal-guard-plus": true,
      "market-intel-pro": true,
    },
  },
  {
    feature: "Priority Support",
    values: {
      "signal-guard": false,
      "signal-guard-plus": false,
      "market-intel-pro": true,
    },
  },
  {
    feature: "Real-time News Feed",
    values: {
      "signal-guard": false,
      "signal-guard-plus": true,
      "market-intel-pro": true,
    },
  },
  {
    feature: "Multi-account Sync",
    values: {
      "signal-guard": false,
      "signal-guard-plus": false,
      "market-intel-pro": true,
    },
  },
];

export function getPlanFeatures(planId: PlanId) {
  return comparisonRows.map((row) => ({
    label: row.feature,
    included: row.values[planId],
  }));
}

export const currentPlanMeta = {
  name: "Premium Plan",
  planId: "signal-guard-plus" as PlanId,
  renewalDate: "May 15, 2026",
  nextBillingDate: "May 15, 2026",
  description:
    "Full access to Signal Guard Plus — advanced AI signals, risk rules, and chatbot support.",
};
