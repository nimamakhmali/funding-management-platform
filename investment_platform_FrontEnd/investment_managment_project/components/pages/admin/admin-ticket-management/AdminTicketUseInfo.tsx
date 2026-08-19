import TicketManagement from "./AdminTicketManagement";
import TicketUserInfo from "./TicketUserInfo";
import { TicketData } from "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

interface Props {
data:TicketData;
}

export default function TicketSidebar({
data
}:Props){

    return (
      <div className="col-span-4 flex flex-col gap-6">
        <TicketManagement
        statuses={data.statuses}
        assignees={data.assignees}
        />
       <TicketUserInfo
       user={data.user}
       />
     </div>
)
}