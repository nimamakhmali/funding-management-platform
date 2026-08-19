export interface NotificationTab {
  title: string;
  href: string;
  segment: string | null;
  badge?: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  system: number;
}