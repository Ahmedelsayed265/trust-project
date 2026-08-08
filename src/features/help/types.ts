export type HelpArticleSummary = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  icon: string;
  views: number;
};

export type HelpArticle = HelpArticleSummary & {
  body: string;
};

export type HelpListData = {
  items: HelpArticleSummary[];
  categories: string[];
};

export type GetHelpInput = {
  category?: string;
  search?: string;
};

export const HELP_CATEGORY_LABELS: Record<string, string> = {
  'getting-started': 'Getting started',
  trading: 'Trading',
  security: 'Security',
  billing: 'Billing',
};
