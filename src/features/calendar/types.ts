export type CalendarImpact = 'high' | 'medium' | 'low';
export type CalendarCategory =
  'economic' | 'earnings' | 'crypto' | 'dividend' | 'ipo';

export type CalendarEvent = {
  id: number;
  title: string;
  description: string;
  category: CalendarCategory | string;
  impact: CalendarImpact | string;
  country: string | null;
  symbol: string | null;
  all_day: boolean;
  day: number;
  date: string;
  time_label: string;
  starts_at: string;
  ends_at: string | null;
  actual: string | null;
  forecast: string | null;
  previous: string | null;
};

export type CalendarMonthData = {
  items: CalendarEvent[];
  month: string;
  month_label: string;
  days_in_month: number;
  starts_on: number;
  from: string;
  to: string;
  highlighted_days: number[];
};

export type GetCalendarInput = {
  month?: string;
  from?: string;
  to?: string;
  impact?: CalendarImpact;
  category?: CalendarCategory;
};

export type GetCalendarUpcomingInput = {
  limit?: number;
};
