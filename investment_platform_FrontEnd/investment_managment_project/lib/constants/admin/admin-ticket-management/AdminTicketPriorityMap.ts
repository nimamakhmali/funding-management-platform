import { TicketPriority } from "@/lib/types/admin/admin-ticket-management/AdminTicketTable";

export const ADMIN_TICKET_PRIORITY_MAP: Record<
  TicketPriority,
  {
    label: string;
    className: string;
  }
> = {
  urgent: {
    label: "فوری",
    className: "bg-red-50 text-red-600",
  },

  high: {
    label: "بالا",
    className: "bg-yellow-50 text-yellow-700",
  },

  medium: {
    label: "متوسط",
    className: "bg-orange-50 text-orange-600",
  },
};