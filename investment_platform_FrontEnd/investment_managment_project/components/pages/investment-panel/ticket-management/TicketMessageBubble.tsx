import { Headset, Image as ImageIcon } from "lucide-react";

import { TicketMessage } from "@/lib/types/investment-panel/ticket-management/TicketDetail";
import { cn } from "@/lib/utils";

export default function TicketMessageBubble({
  message,
}: {
  message: TicketMessage;
}) {
  const isAgent = message.sender === "agent";

  return (
    <article
      className={cn(
        "flex flex-col gap-1 max-w-[85%] md:max-w-[70%]",
        isAgent ? "items-end ml-auto" : "items-start mr-auto",
      )}
      aria-label={`پیام ${message.authorName} در ساعت ${message.time}`}
    >
      <div className="mb-1 flex items-center gap-2">
        {isAgent && (
          <span
            className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Headset className="text-[14px]" size={14} />
          </span>
        )}
        <span className="text-sm font-bold text-text-main">
          {message.authorName}
        </span>
        <time
          className="text-xs text-text-secondary"
          dateTime={message.dateTime}
        >
          {message.time}
        </time>
      </div>

      <div
        className={cn(
          "p-4 text-sm leading-relaxed text-text-main rounded-2xl shadow-sm",
          isAgent
            ? "bg-[#f5f3ff] border border-primary/10 rounded-tl-sm"
            : "bg-gray-100 rounded-tr-sm",
        )}
      >
        <p className="whitespace-pre-line">{message.text}</p>
      </div>

      {message.attachment && (
        <div className="mt-2 flex w-fit cursor-pointer items-center gap-3 rounded-lg border border-border bg-gray-50 p-2 transition-colors hover:bg-gray-100">
          <span className="rounded-md bg-purple-100 p-2 text-purple-600">
            <ImageIcon size={20} />
          </span>
          <span className="flex flex-col">
            <span className="text-xs font-medium text-text-main">
              {message.attachment.name}
            </span>
            <span className="text-[10px] text-text-secondary">
              {message.attachment.size}
            </span>
          </span>
        </div>
      )}
    </article>
  );
}
