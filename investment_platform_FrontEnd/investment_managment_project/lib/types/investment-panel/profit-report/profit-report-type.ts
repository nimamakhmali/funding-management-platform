import { ReactNode } from "react";

export type ProfitReportCardProps = {
  title: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  iconClassName: string;
  badge?: {
    text: string;
    icon?: ReactNode;
    className: string;
  };
  bottomBarClassName?: string;
};