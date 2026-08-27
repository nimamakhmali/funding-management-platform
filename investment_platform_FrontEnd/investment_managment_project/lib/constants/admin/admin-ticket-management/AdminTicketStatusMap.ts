import { TicketStatus } from "@/lib/types/admin/admin-ticket-management/AdminTicketTable";

export const ADMIN_TICKET_STATUS_MAP: Record<
  TicketStatus,
  { label: string; className: string }
> = {
  // مقادیر واقعی backend
  OPEN: {
    label: "باز",
    className: "bg-primary/10 text-primary",
  },
  IN_PROGRESS: {
    label: "در حال بررسی",
    className: "bg-blue-50 text-blue-600",
  },
  CLOSED: {
    label: "بسته شده",
    className: "bg-green-50 text-green-600",
  },
  USER_REPLIED: {
    label: "پاسخ کاربر",
    className: "bg-yellow-50 text-yellow-700",
  },
  ADMIN_REPLIED: {
    label: "پاسخ ادمین",
    className: "bg-purple-50 text-purple-600",
  },
};