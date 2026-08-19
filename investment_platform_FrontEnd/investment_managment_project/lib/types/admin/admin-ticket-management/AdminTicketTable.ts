import { ReactNode } from "react";

export type TicketStatus =
  | "waiting"
  | "processing"
  | "closed";

export type TicketPriority =
  | "urgent"
  | "high"
  | "medium";

export type TicketTableItem = {
  id: number;
  ticketId: string;
  subject: string;
  user: string;
  priority: TicketPriority;
  status: TicketStatus;
  updatedAt: string;
};