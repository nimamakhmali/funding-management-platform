import { Column } from "@/components/ui/ReusableTable";
import {TicketTableItem} from 
"@/lib/types/admin/admin-ticket-management/AdminTicketTable";

import { ADMIN_TICKET_PRIORITY_MAP } from 
"@/lib/constants/admin/admin-ticket-management/AdminTicketPriorityMap";

import { ADMIN_TICKET_STATUS_MAP } from 
"@/lib/constants/admin/admin-ticket-management/AdminTicketStatusMap";

export const ADMIN_TICKET_COLUMNS: Column<TicketTableItem>[] = [
  {
    header: "شناسه تیکت",
    accessor: "ticketId",
  },

  {
    header: "عنوان موضوع",
    accessor: "subject",
  },

  {
    header: "نام کاربر",
    accessor: "user",
  },

  {
  header: "اولویت",
  accessor: (row) => {
    const priority = ADMIN_TICKET_PRIORITY_MAP[row.priority];

    return (
      <span
        className={`rounded-md px-2 py-1 text-[11px] font-bold ${priority.className}`}
      >
        {priority.label}
      </span>
    );
  },
},

 {
  header: "وضعیت",
  accessor: (row) => {
    const status = ADMIN_TICKET_STATUS_MAP[row.status];

    return (
      <span
        className={`rounded-md px-2 py-1 text-[11px] font-bold ${status.className}`}
      >
        {status.label}
      </span>
    );
  },
},

  {
    header: "بروزرسانی",
    accessor: "updatedAt",
  },

  {
    header: "عملیات",
    accessor: () => (
      <button className="text-xs font-bold text-primary hover:underline">
        مشاهده جزئیات
      </button>
    ),
  },
];