import NotificationCard from "./NotificationCard";
import EmptyState from "./EmptyState";
import { Notification } from "@/lib/types/admin/notification/notification-types";

interface NotificationListProps {
  notifications: Notification[];
}

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  if (!notifications.length) {
    return <EmptyState />;
  }

  return (
    <section
      className="
        flex
        flex-col
        gap-4
      "
    >
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </section>
  );
}