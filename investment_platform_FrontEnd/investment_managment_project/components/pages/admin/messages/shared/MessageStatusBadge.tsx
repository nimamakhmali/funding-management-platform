import { MessageStatus } from "@/lib/types/admin/messages/message.types";

interface Props {
  status: MessageStatus;
}

export function MessageStatusBadge({
  status,
}: Props) {
  if (status === "unread") {
    return (
      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
        خوانده نشده
      </span>
    );
  }

  if (status === "archived") {
    return (
      <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
        آرشیو
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
      خوانده شده
    </span>
  );
}