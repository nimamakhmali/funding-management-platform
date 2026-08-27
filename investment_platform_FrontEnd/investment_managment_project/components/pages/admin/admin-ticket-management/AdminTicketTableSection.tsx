"use client";

import { ReusableTable, Column } from "@/components/ui/ReusableTable";
import { AdminTicket } from "@/lib/api/services/admin.service";
import {
  TicketTableItem,
  TicketPriority,
  TicketStatus,
} from "@/lib/types/admin/admin-ticket-management/AdminTicketTable";
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

// backend مقادیر uppercase می‌فرستد — مستقیم pass می‌کنیم
function mapPriority(priority: string): TicketPriority {
  const valid: TicketPriority[] = ["HIGH", "MEDIUM", "LOW"];
  return valid.includes(priority as TicketPriority)
    ? (priority as TicketPriority)
    : "MEDIUM";
}

function mapStatus(status: string): TicketStatus {
  if (status === "CLOSED") return "closed";
  if (status === "IN_PROGRESS" || status === "USER_REPLIED" || status === "ADMIN_REPLIED") {
    return "processing";
  }
  return "waiting";
}

function mapTicket(t: AdminTicket, index: number): TicketTableItem {
  return {
    id: index + 1,
    ticketId: t.id.slice(0, 8).toUpperCase(),
    subject: t.subject,
    user:
      t.user.full_name ||
      t.user.phone_number ||
      "کاربر ناشناس",
    priority: mapPriority(t.priority),
    status: mapStatus(t.status),
    updatedAt: t.updated_at
      ? new Date(t.updated_at).toLocaleDateString("fa-IR")
      : "—",
  };
}

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

  // ستون‌ها داخل component تا onSelectTicket در دسترس باشد
  const columns: Column<TicketTableItem>[] = [
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
        if (!priority) return <span>—</span>;
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
        if (!status) return <span>—</span>;
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
      accessor: (row) => {
        // پیدا کردن id اصلی از data اولیه با ticketId
        const original = data.find(
          (t) => t.id.slice(0, 8).toUpperCase() === row.ticketId
        );
        const isSelected = original?.id === selectedTicketId;
        return (
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (original) onSelectTicket(original.id);
            }}
            className={`text-xs font-bold transition-colors hover:underline ${
              isSelected ? "text-green-600" : "text-primary"
            }`}
          >
            {isSelected ? "در حال مشاهده" : "مشاهده جزئیات"}
          </button>
        );
      },
    },
  ];

  return (
    <ReusableTable
      columns={columns}
      data={tableData}
      enablePagination
      itemsPerPage={10}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      emptyMessage="هیچ تیکتی یافت نشد"
    />
  );
}