import type { TicketStatus, TicketPriority } from "./Ticket";

export type TicketMessageSender = "user" | "agent";

export type TicketAttachment = {
  name: string;
  size: string;
  type: "image" | "file";
};

export type TicketMessage = {
  id: string;
  sender: TicketMessageSender;
  authorName: string;
  time: string;
  dateTime: string;
  text: string;
  attachment?: TicketAttachment;
};

export type TicketDetail = {
  id: string;
  subject: string;
  status: TicketStatus;
  statusLabel: string;
  priority: TicketPriority;
  createdAt: string;
  createdDateTime: string;
  updatedAt: string;
  messages: TicketMessage[];
};
