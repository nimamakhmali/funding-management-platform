import {MessageSquareQuote} from "lucide-react";

interface Props {
title:string;
category:string;
createdAt:string;
}



export default function TicketHeader({
title,
category,
createdAt
}:Props){

    return (
        <div className="p-5 border-b border-gray-100 flex items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <MessageSquareQuote/>
            </div>
          <div>
          <h3 className="font-bold text-text-main">
          {title}
          </h3>
          <p className="text-xs text-text-main">
          {category} -ارسال شده در {createdAt}
          </p>
          </div>
        </div>
    </div>
)
}