import { ReactNode } from "react";

export interface ProfitSummaryCard {
  title: string;
  value: number;
  unit: string;
  description: string;
  icon: ReactNode;
  highlighted?: boolean;
}