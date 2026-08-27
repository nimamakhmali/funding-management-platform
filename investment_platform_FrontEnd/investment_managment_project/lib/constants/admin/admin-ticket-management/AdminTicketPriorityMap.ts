import { TicketPriority } from "@/lib/types/admin/admin-ticket-management/AdminTicketTable";

export const ADMIN_TICKET_PRIORITY_MAP: Record<
  TicketPriority,
  { label: string; className: string }
> = {
  // مقادیر واقعی backend
  HIGH: {
    label: "بالا",
    className: "bg-red-50 text-red-600",
  },
  MEDIUM: {
    label: "متوسط",
    className: "bg-yellow-50 text-yellow-700",
  },
  LOW: {
    label: "پایین",
    className: "bg-gray-100 text-gray-600",
  },
};