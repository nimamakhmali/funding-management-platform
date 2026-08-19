import { Message } from "@/lib/types/admin/messages/message.types";

interface Props {
  message: Message;
}

export function MessageDetailBody({
  message,
}: Props) {
  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="leading-8 text-text-main whitespace-pre-wrap">
        {message.body}
      </div>
    </div>
  );
}