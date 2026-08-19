export type MessageStatus = "unread" | "read" | "archived";

export type MessageFilterType =
  | "all"
  | "unread"
  | "archived";

export type MessageSenderType =
  | "admin"
  | "support"
  | "system";

export interface Message {
  id: string;

  title: string;

  body: string;

  preview: string;

  status: MessageStatus;

  senderType: MessageSenderType;

  senderName: string;

  senderEmail: string;

  createdAt: string;

  updatedAt: string;

  replyCount: number;
}