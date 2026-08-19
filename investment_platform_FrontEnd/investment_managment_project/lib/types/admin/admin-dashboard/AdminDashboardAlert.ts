import { ReactNode } from "react";

export type AdminDashboardAlertProps = {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: ReactNode;
  iconClassName: string;
};