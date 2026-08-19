import { Message } from "@/lib/types/admin/messages/message.types";

export function searchMessages(
  messages: Message[],
  query: string
) {
  if (!query.trim()) {
    return messages;
  }

  const value = query.toLowerCase();

  return messages.filter(
    (message) =>
      message.title
        .toLowerCase()
        .includes(value) ||
      message.body
        .toLowerCase()
        .includes(value) ||
      message.senderName
        .toLowerCase()
        .includes(value)
  );
}