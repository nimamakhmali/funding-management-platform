"use client";

import { useMessages } from "@/lib/hooks/messages/useMessages";

import { MessageDetailHeader } from "../content/MessageDetailHeader";

import { MessageDetailBody } from "../content/MessageDetailBody";

import { MessageReplyBox } from "../content/MessageReplyBox";

interface Props {
  messageId: string;
}

export function MessageContentContainer({
  messageId,
}: Props) {
  const { messages } =
    useMessages();

  const message =
    messages.find(
      (item) =>
        item.id === messageId
    );

  if (!message) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border bg-surface">
        <p className="text-text-muted">
          پیام پیدا نشد
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface">
      <MessageDetailHeader
        message={message}
      />

      <MessageDetailBody
        message={message}
      />

      <MessageReplyBox
        messageId={message.id}
      />
    </div>
  );
}