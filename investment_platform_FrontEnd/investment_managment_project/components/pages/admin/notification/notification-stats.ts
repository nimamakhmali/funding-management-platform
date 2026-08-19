import { notifications } from "@/lib/constants/admin/notification/notification";

export function getNotificationStats() {
  return {
    total: notifications.length,
    unread: notifications.filter(item => !item.read).length,
    system: notifications.filter(item => item.type === "system").length,
  };
}