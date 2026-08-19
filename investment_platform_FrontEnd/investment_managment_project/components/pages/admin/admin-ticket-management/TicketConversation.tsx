import TicketConversationHeader from "./TicketConversationHeader";
import TicketMessageList from "./TicketMessageList";
import TicketReplyBox from "./TicketReplyBox";
import { TicketConversationData } from 
"@/lib/types/admin/admin-ticket-management/ticket.conversation.types";

interface Props {
data: TicketConversationData;
}
export default function TicketConversation({data}:Props)
{
        return (
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col h-[600px]">
               <TicketConversationHeader 
                title={data.title}
                category={data.category}
                createdAt={data.createdAt} />

               <TicketMessageList messages={data.messages} />
               <TicketReplyBox/>
            </div>
)

}