export type AdminTransactionStatus =
  | "success"
  | "pending"
  | "failed";

export type AdminTransaction = {
  id: string;
  user: {
    name: string;
    initials: string;
  };
  type: string;
  amount: number;
  status: AdminTransactionStatus;
  date: string;
};