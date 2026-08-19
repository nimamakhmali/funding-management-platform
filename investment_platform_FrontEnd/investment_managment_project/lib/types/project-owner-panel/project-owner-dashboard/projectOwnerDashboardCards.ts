import { ReactNode } from "react";

export type ProjectOwnerDashboardCards = {
  title: string;
  value: string;
  unit?: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
  badge?: {
    text: string;
    icon?: ReactNode;
    className: string;
  };
  bottomBarClassName?: string;
};