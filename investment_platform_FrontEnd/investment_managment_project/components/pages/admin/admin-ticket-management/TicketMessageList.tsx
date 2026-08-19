import TicketMessageItem from "./TicketMessageItem";
import { TicketMessage } from "@/lib/types/admin/admin-ticket-management/ticket.conversation.types";

interface Props {
messages:TicketMessage[];
}



export default function TicketMessageList({
messages
}:Props){

return (
   <div className="flex-1 overflow-y-auto p-6 bg-white">
    {
     messages.map(message=>(
     <TicketMessageItem
     key={message.id}
     message={message}
      />
))
}
</div>
)
}