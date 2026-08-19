export type AdminProjectManagementStatus =
  | "pending"
  | "approved"
  | "rejected";

export type AdminProjectManagementRow = {
  id: string;
  name: string;
  owner: string;
  category: string;
  date: string;
  amount: number;
  status: AdminProjectManagementStatus;
};