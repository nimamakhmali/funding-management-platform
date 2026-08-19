import { ReactNode } from "react";

export type TransactionStatus =
  | "completed"
  | "pending"
  | "failed";

export type AdminDashboardTransaction = {
  id: number;
  transactionId: string;
  user: {
    name: string;
    avatar?: ReactNode;
  };
  operation: string;
  amount: number;
  date: string;
  status: TransactionStatus;
};