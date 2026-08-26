// components/pages/admin/admin-ticket-management/TicketConversation.tsx
import TicketConversationHeader from "./TicketConversationHeader";
import TicketMessageList from "./TicketMessageList";
import TicketReplyBox from "./TicketReplyBox";
import { TicketConversationData } from "@/lib/types/admin/admin-ticket-management/ticket.conversation.types";

interface Props {
  data: TicketConversationData;
  ticketId: string;
}

export default function TicketConversation({ data, ticketId }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
      <TicketConversationHeader
        title={data.title}
        category={data.category}
        createdAt={data.createdAt}
      />
      <TicketMessageList messages={data.messages} />
      <TicketReplyBox ticketId={ticketId} />
    </div>
  );
}