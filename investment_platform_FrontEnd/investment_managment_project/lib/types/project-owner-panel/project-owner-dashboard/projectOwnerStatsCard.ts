import { ReactNode } from "react";

export type ProjectOwnerStatsCard = {
  title: string;
  value: string;
  icon: ReactNode;
  iconClassName: string;
  titleClassName?: string;
  cardClassName?: string;
};