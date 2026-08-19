import NotificationList from "@/components/pages/admin/notification/NotificationList";
import { notifications } from "@/lib/constants/admin/notification/notification";

export default function Page() {

  const systemNotifications =
    notifications.filter(
      notification =>
        notification.type === "system"
    );

  return (
    <NotificationList
      notifications={systemNotifications}
    />
  );

}