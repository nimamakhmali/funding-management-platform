"use client";
import {useForm} from "react-hook-form";
import {UserPlus, Lock} from "lucide-react";
import {FormScrollableSelectField}
from "@/components/ui/FormScrollableSelectField";
import { TicketAssignee, TicketStatusOption } from
 "@/lib/types/admin/admin-ticket-management/ticket.userInfo";

interface Props {
statuses:TicketStatusOption[];
assignees:TicketAssignee[];
}

interface FormValues {
status:string;
assignee:number | null;
}

export default function TicketManagement({
statuses,
assignees
}:Props){

const {control}=useForm<FormValues>({
defaultValues:{
status:"pending",
assignee:null
}
});

return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
      <h4 className="font-bold text-sm border-b border-b-gray-100 pb-3">
         کنترل و مدیریت تیکت
      </h4>
        <div className="space-y-4">
          <FormScrollableSelectField control={control} 
          name="status"
          label="تغییر وضعیت تیکت"
          options={statuses}
          getOptionLabel={(item)=>item.label}
          getOptionValue={(item)=>item.value}
        />

         <FormScrollableSelectField control={control} 
         name="assignee"
         label="ارجاع به کارشناس"
         options={assignees}
         getOptionLabel={(item)=> `${item.name} (${item.department})`}
         getOptionValue={(item)=>
         item.id }
         />

         <button className="w-full py-2.5 rounded-lg border border-primary text-primary font-bold
          text-sm flex items-center justify-center gap-2">
          <UserPlus size={18} />
          ارجاع تیکت
         </button>
         <button className="w-full py-2.5 rounded-lg bg-gray-100 font-bold text-sm flex items-center
         justify-center gap-2">
        <Lock size={18}/>
        بستن تیکت
        </button>
      </div>

    </div>

)
}