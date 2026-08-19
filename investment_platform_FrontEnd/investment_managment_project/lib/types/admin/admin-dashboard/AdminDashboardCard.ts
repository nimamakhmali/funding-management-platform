import { ReactNode } from "react";

export type AdminDashboardCardProps = {
  title: string;
  value: string | number;
  unit?: string;

  icon: ReactNode;
  iconClassName: string;

  badge?: {
    value: string;
    icon: ReactNode;
    className: string;
  };
};