import { NotificationTab, NotificationStats } from "@/lib/types/admin/notification/notificationTabs-types";

export function getTabs(stats: NotificationStats): NotificationTab[] {
  return [
    {
      title: "همه",
      href: "/notification",
      segment: null,
      badge: stats.total,
    },
    {
      title: "خوانده نشده",
      href: "/notification/unread",
      segment: "unread",
      badge: stats.unread,
    },
    {
      title: "سیستمی",
      href: "/notification/system",
      segment: "system",
      badge: stats.system,
    },
  ];
}