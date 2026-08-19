import NotificationList from "@/components/pages/admin/notification/NotificationList";
import { notifications } from "@/lib/constants/admin/notification/notification";

export default function Page() {
  return (
    <NotificationList
      notifications={notifications}
    />
  );
}