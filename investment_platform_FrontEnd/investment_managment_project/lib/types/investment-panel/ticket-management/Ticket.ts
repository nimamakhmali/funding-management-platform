export type TicketStatus = "open" | "in_progress" | "closed";

export type TicketPriority = "high" | "medium" | "low";

export type Ticket = {
  id: string;
  title: string;
  department: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: string;
  updatedAt: string;
};
