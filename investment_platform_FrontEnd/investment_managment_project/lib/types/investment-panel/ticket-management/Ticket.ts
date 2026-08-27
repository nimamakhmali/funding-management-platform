export type TicketStatus = "open" | "in_progress" | "closed";
export type TicketPriority = "low" | "medium" | "high";

export interface Ticket {
  id: string;          // UUID کامل — برای routing و API calls
  displayId: string;   // ← جدید: ۸ کاراکتر برای نمایش در جدول
  title: string;
  department: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
}