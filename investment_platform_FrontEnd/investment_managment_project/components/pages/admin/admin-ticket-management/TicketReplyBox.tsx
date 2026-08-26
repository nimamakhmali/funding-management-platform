// components/pages/admin/admin-ticket-management/TicketReplyBox.tsx
"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAdminReplyTicket } from "@/lib/hooks/useAdmin";

interface Props {
  ticketId: string;
}

export default function TicketReplyBox({ ticketId }: Props) {
  const [message, setMessage] = useState("");
  const replyMutation = useAdminReplyTicket();

  const handleSend = async () => {
    if (!message.trim() || !ticketId) return;

    try {
      await replyMutation.mutateAsync({ id: ticketId, message: message.trim() });
      setMessage("");
    } catch {
      // خطا توسط React Query مدیریت می‌شود
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t border-t-gray-100 bg-white rounded-b-xl">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="پاسخ خود را اینجا بنویسید... (Ctrl+Enter برای ارسال)"
        className="w-full bg-gray-200 rounded-xl p-4 text-sm resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-primary/20"
        rows={3}
        disabled={replyMutation.isPending}
      />
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSend}
          disabled={replyMutation.isPending || !message.trim()}
          className="bg-primary text-white px-8 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition"
        >
          {replyMutation.isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Send size={16} />
          )}
          ارسال پاسخ
        </button>
      </div>
    </div>
  );
}