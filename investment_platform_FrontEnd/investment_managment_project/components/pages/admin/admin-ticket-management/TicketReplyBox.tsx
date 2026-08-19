import {Send} from "lucide-react";

export default function TicketReplyBox(){
   return (
     <div className="p-4 border-t border-t-gray-100 bg-white rounded-b-xl">
      <textarea
       placeholder="پاسخ خود را اینجا بنویسید..."
       className="w-full bg-gray-200 rounded-xl p-4 text-sm resize-none mb-3"
       />
     <div className="flex justify-end">
        <button className="bg-primary text-white px-8 py-2 rounded-lg flex items-center gap-2">
          <Send/>
          ارسال پاسخ
        </button>
      </div>
   </div>
)
}