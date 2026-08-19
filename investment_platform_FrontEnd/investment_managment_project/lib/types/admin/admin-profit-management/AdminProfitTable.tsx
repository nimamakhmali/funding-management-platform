export type AdminProfitCalculationStatus =
  | "calculated"
  | "processing";

export type AdminProfitApproveStatus =
  | "approved"
  | "pending"
  | "unknown";

export type AdminProfitTableRow = {
  id: string;
  title: string;
  period: string;
  amount: number;
  investors: number;
  calculationStatus: AdminProfitCalculationStatus;
  approveStatus: AdminProfitApproveStatus;
}