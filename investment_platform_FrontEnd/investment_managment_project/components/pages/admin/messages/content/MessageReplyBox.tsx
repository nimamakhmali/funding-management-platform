"use client";

import {
  useState,
} from "react";

import { Send } from "lucide-react";

import { useMessages } from "@/lib/hooks/messages/useMessages";

interface Props {
  messageId: string;
}

export function MessageReplyBox({
  messageId,
}: Props) {
  const [reply, setReply] =
    useState("");

  const { sendReply } =
    useMessages();

  const handleSend =
    async () => {
      if (!reply.trim()) {
        return;
      }

      await sendReply(
        messageId,
        reply
      );

      setReply("");
    };

  return (
    <div className="border-t border-border p-4">
      <textarea
        value={reply}
        onChange={(e) =>
          setReply(
            e.target.value
          )
        }
        placeholder="پاسخ خود را بنویسید..."
        className="min-h-[120px] w-full rounded-xl border border-border p-3 outline-none focus:border-primary"
      />

      <div className="mt-3 flex justify-end">
        <button
          onClick={handleSend}
          className="flex items-center gap-2 rounded-xl bg-primary px-5 py-2 text-white"
        >
          <Send size={18} />

          ارسال پاسخ
        </button>
      </div>
    </div>
  );
}