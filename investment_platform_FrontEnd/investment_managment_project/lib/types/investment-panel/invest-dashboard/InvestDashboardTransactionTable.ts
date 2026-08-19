import { ReactNode } from "react";

export type InvestDashboardTransactionStatus =
  | "success"
  | "pending"
  | "failed";

export type InvestDashboardTransactionTableItem = {
  id: number;
  date: string;
  title: string;
  amount: string;
  status: InvestDashboardTransactionStatus;
  icon: ReactNode;
};