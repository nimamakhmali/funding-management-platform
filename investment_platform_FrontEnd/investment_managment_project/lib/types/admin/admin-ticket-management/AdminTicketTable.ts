import { ReactNode } from "react";

// مطابق با مقادیر واقعی backend
export type TicketStatus =
  | "waiting"
  | "processing"
  | "closed";

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