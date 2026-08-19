import {ExternalLink} from "lucide-react";
import { TicketUserInfo as UserType } from 
"@/lib/types/admin/admin-ticket-management/ticket.userInfo";

interface Props {
user:UserType;
}



export default function TicketUserInfo({
user
}:Props){

   return (
     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
       <h4 className="font-bold text-sm border-b border-b-gray-100 pb-3 mb-4">
        اطلاعات کاربر     
       </h4>
       <div className="space-y-4">
         <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100" />
          <div>
            <p className="text-sm font-bold">
             {user.name}
            </p>
            <p className="text-[10px] text-sidebar-text">
             شناسه کاربری: {user.id}    
            </p>
         </div>
      </div>
         <div className="grid grid-cols-2 gap-4">
           <div className="p-3 bg-gray-100 rounded-lg">
             <p className="text-[10px]">
             سطح کاربری   
             </p>
             <p className="text-xs font-bold">
             {user.level}
             </p>
            </div>
           <div className="p-3 bg-gray-100 rounded-lg">
             <p className="text-[10px]">
              تیکت‌های باز   
             </p>
             <p className="text-xs font-bold">
               {user.openTickets}
             </p>
           </div>
         </div>
          <button className="w-full text-xs text-primary font-bold flex justify-center items-center gap-1">
            مشاهده پروفایل کامل    
            <ExternalLink size={14}/>
          </button>
      </div>
    </div>
)
}