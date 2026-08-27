import { ReactNode } from "react";

// مطابق با مقادیر واقعی backend
export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "CLOSED"
  | "USER_REPLIED"
  | "ADMIN_REPLIED";

export type TicketPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type TicketTableItem = {
  id: number;
  ticketId: string;
  subject: string;
  user: string;
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
};