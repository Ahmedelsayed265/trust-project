export type FaqCategory =
  'general' | 'trading' | 'account' | 'billing' | 'security';

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
  category: FaqCategory | string;
};

export type FaqsData = {
  items: FaqItem[];
  categories: string[];
};

export const FAQ_CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  trading: 'Trading',
  account: 'Account',
  billing: 'Billing',
  security: 'Security',
};
