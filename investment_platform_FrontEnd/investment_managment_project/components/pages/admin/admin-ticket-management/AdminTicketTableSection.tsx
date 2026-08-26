import { ReusableTable, Column } from "@/components/ui/ReusableTable";
import { AdminTicket } from "@/lib/api/services/admin.service";
import { TicketTableItem, TicketPriority, TicketStatus } from "@/lib/types/admin/admin-ticket-management/AdminTicketTable";

import { ADMIN_TICKET_PRIORITY_MAP } from "@/lib/constants/admin/admin-ticket-management/AdminTicketPriorityMap";
import { ADMIN_TICKET_STATUS_MAP } from "@/lib/constants/admin/admin-ticket-management/AdminTicketStatusMap";

interface Props {
  data: AdminTicket[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSelectTicket: (id: string) => void;
  selectedTicketId: string | null;
}

function mapPriority(priority: string): TicketPriority {
  if (priority === "urgent" || priority === "high" || priority === "medium") {
    return priority;
  }
  return "medium";
}

function mapStatus(status: string): TicketStatus {
  if (status === "waiting" || status === "processing" || status === "closed") {
    return status;
  }
  return "waiting";
}

function mapTicket(t: AdminTicket, index: number): TicketTableItem {
  return {
    id: index + 1,
    ticketId: t.id.slice(0, 8).toUpperCase(),
    subject: t.subject,
    user: t.user.full_name || t.user.phone_number,
    priority: mapPriority(t.priority),
    status: mapStatus(t.status),
    updatedAt: t.updated_at,
  };
}

const ADMIN_TICKET_COLUMNS: Column<TicketTableItem>[] = [
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
        <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${priority.className}`}>
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
        <span className={`rounded-md px-2 py-1 text-[11px] font-bold ${status.className}`}>
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
    accessor: (row) => (
      <button className="text-xs font-bold text-primary hover:underline">
        مشاهده جزئیات
      </button>
    ),
  },
];

export default function AdminTicketTableSection({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onSelectTicket,
  selectedTicketId,
}: Props) {
  const tableData = data.map(mapTicket);

  return (
    <ReusableTable
      columns={ADMIN_TICKET_COLUMNS}
      data={tableData}
      enablePagination
      enableFilter
      itemsPerPage={10}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onRowClick={(row) => onSelectTicket(data[row.id - 1]?.id ?? "")}
      emptyMessage="هیچ تیکتی یافت نشد"
    />
  );
}
