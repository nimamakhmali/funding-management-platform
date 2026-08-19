import { ReactNode } from "react";

export type ProjectDetailsCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  iconClassName: string;
  badge?: {
    text: string;
    icon?: ReactNode;
    className: string;
  };
  date: string
};