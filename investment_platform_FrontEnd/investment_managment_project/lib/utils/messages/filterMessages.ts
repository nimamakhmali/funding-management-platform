import {
  Message,
  MessageFilterType,
} from "@/lib/types/admin/messages/message.types";

export function filterMessages(
  messages: Message[],
  filter: MessageFilterType
) {
  if (filter === "all") {
    return messages;
  }

  return messages.filter(
    (message) => message.status === filter
  );
}