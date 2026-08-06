export type NotificationType = 'trade' | 'signal' | 'account' | 'system';

export type Notification = {
  id: number;
  title: string;
  description: string;
  type: NotificationType;
  href: string | null;
  data: Record<string, unknown> | unknown[] | null;
  read: boolean;
  read_at: string | null;
  time: string;
  created_at: string;
};

export type NotificationCounts = Record<NotificationType, number>;

export type NotificationsPagination = {
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

export type NotificationsListData = {
  items: Notification[];
  unread_count: number;
  counts: NotificationCounts;
  pagination: NotificationsPagination;
};

export type UnreadCountData = {
  unread_count: number;
};
