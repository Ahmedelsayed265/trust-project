export type ReferralStats = {
  total_earned: number;
  invites_sent: number;
  joined: number;
  rewarded: number;
  currency: string;
};

export type ReferralReward = {
  title: string;
  description: string;
};

export type ReferralInvite = {
  id: number;
  name: string;
  email: string;
  status: string;
  status_label: string;
  is_done: boolean;
  reward: string;
  reward_amount: number;
  currency: string;
  joined_at: string | null;
  created_at: string;
};

export type ReferralsData = {
  code: string;
  link: string;
  stats: ReferralStats;
  rewards: ReferralReward[];
  invites: ReferralInvite[];
};

export type InviteByEmailInput = {
  email: string;
  name?: string;
};
