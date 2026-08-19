import { TicketStatus } from "@/lib/types/admin/admin-ticket-management/AdminTicketTable";

export const ADMIN_TICKET_STATUS_MAP: Record<
  TicketStatus,
  {
    label: string;
    className: string;
  }
> = {
  waiting: {
    label: "در انتظار پاسخ",
    className: "bg-primary/10 text-primary",
  },

  processing: {
    label: "در حال بررسی",
    className: "bg-blue-50 text-blue-600",
  },

  closed: {
    label: "بسته شده",
    className: "bg-green-50 text-green-600",
  },
};