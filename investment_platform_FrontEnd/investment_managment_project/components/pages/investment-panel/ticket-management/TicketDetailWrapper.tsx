// components/pages/investment-panel/ticket-management/TicketDetailWrapper.tsx
"use client";

import { useTicketDetail, useReplyTicket, useCloseTicket } from "@/lib/hooks/useTickets";
import { useAuthStore } from "@/lib/store/auth.store";
import { mapTicketDetail, mapMessage } from "@/lib/utils/ticket.utils";
import TicketDetail from "./TicketDetail";
import TicketDetailHeader from "./TicketDetailHeader";
import TicketChat from "./TicketChat";
import TicketReplyBox from "./TicketReplyBox";
import type { BackendTicketMessage } from "@/lib/api/services/ticket.service";

interface Props {
  id: string;
}

function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-4 p-6">
      <div className="h-8 bg-gray-100 rounded w-1/3" />
      <div className="h-40 bg-gray-100 rounded" />
      <div className="h-20 bg-gray-100 rounded" />
    </div>
  );
}

export default function TicketDetailWrapper({ id }: Props) {
  const user = useAuthStore((s) => s.user);
  const { data: backendTicket, isLoading, refetch } = useTicketDetail(id);
  const replyMutation = useReplyTicket(id);
  const closeMutation = useCloseTicket();

  if (isLoading) return <SkeletonDetail />;

  if (!backendTicket) {
    return (
      <div className="text-center py-16 text-gray-400 text-sm">
        تیکت یافت نشد
      </div>
    );
  }

  const currentUserId = user?.id ?? "";
  const ticket = mapTicketDetail(backendTicket, currentUserId);

  const handleSend = async (text: string) => {
    replyMutation.mutate(
      { message: text },
      { onSuccess: () => refetch() }
    );
  };

  const handleClose = async () => {
    closeMutation.mutate(id, {
      onSuccess: () => refetch(),
    });
  };

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-1 flex-col">
      {/* هدر با قابلیت بستن تیکت */}
      <TicketDetailHeader
        ticket={ticket}
        onClose={
          ticket.status !== "closed" ? handleClose : undefined
        }
        isClosing={closeMutation.isPending}
      />

      <div className="relative flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
        <TicketChat messages={ticket.messages} />

        {/* فقط وقتی تیکت بسته نیست، باکس reply نشان بده */}
        {ticket.status !== "closed" && (
          <TicketReplyBox
            onSend={handleSend}
            isSending={replyMutation.isPending}
          />
        )}

        {ticket.status === "closed" && (
          <div className="p-4 text-center text-sm text-gray-400 border-t border-border">
            این تیکت بسته شده است
          </div>
        )}
      </div>
    </div>
  );
}