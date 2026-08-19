import { TicketMessage } from 
"@/lib/types/admin/admin-ticket-management/ticket.conversation.types";


interface Props{
message:TicketMessage;
}

export default function TicketMessageItem({
message
}:Props){

const isAgent = message.author.type==="agent";
return (
     <div className={`flex flex-col gap-2 max-w-[85%] ${isAgent ? "items-end mr-auto" : "items-start"}`}>
        <div className="flex gap-2 items-center">
         <span className="text-xs font-bold">
          {isAgent ? `پشتیبان: ${message.author.name}` : message.author.name}
         </span>
         <span className="text-[10px] text-text-main">
         {message.createdAt}
         </span>
        </div>

        <div className={`p-4 rounded-xl text-sm leading-relaxed 
        ${isAgent ? "bg-primary text-white rounded-tl-none" :
        "bg-white border border-gray-100 rounded-tr-none"}`}>
        {message.message}
       </div>
    </div>
)
}