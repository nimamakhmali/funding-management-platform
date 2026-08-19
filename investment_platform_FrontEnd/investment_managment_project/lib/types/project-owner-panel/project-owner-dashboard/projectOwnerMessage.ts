import { ReactNode } from "react";

export type ProjectOwnerMessage = {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
  isUnread: boolean;
  iconClassName: string;
};