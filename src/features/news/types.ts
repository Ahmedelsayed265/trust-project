export type NewsSentiment = 'bullish' | 'bearish' | 'neutral' | string;

export type NewsItem = {
  id: number;
  slug: string;
  title: string;
  summary: string;
  tag: string;
  source: string;
  source_url: string | null;
  image: string | null;
  symbols: string[];
  sentiment: NewsSentiment;
  is_featured: boolean;
  time: string;
  published_at: string;
};

export type NewsArticle = NewsItem & {
  body: string;
};

export type NewsPagination = {
  current_page: number;
  first_page_url: string | null;
  from: number | null;
  last_page: number;
  last_page_url: string | null;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};

export type NewsListData = {
  items: NewsItem[];
  tags: string[];
  pagination: NewsPagination;
};

export type GetNewsInput = {
  tag?: string;
  symbol?: string;
  search?: string;
  page?: number;
  per_page?: number;
};
