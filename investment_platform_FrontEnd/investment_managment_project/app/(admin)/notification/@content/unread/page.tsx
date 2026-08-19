import NotificationList from "@/components/pages/admin/notification/NotificationList";
import { notifications } from "@/lib/constants/admin/notification/notification";

export default function Page() {

  const unreadNotifications =
    notifications.filter(
      notification => !notification.read
    );

  return (
    <NotificationList
      notifications={unreadNotifications}
    />
  );

}