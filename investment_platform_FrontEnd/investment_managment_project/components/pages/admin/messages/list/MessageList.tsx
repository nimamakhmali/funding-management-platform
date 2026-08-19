import { Message } from "@/lib/types/admin/messages/message.types";

import { MessageListItem } from "./MessageListItem";

interface Props {
  messages: Message[];
}

export function MessageList({
  messages,
}: Props) {
  if (
    messages.length === 0
  ) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed">
        <p className="text-text-muted">
          پیامی پیدا نشد
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-3 overflow-y-auto">
      {messages.map(
        (message) => (
          <MessageListItem
            key={message.id}
            message={message}
          />
        )
      )}
    </div>
  );
}