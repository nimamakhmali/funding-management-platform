import { LucideIcon } from "lucide-react";

export type NotificationType =
  | "project"
  | "finance"
  | "system"
  | "message";

export interface NotificationAction {
  label: string;
  href: string;
}

export interface Notification {
  id: number;

  title: string;

  description: string;

  type: NotificationType;

  icon: LucideIcon;

  read: boolean;

  createdAt: string;

  action: NotificationAction;
}

