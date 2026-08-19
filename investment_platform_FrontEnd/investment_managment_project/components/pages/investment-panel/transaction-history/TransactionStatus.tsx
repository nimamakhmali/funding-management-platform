import { ReactNode } from "react";
type Props = {
  status: "success" | "pending" | "failed";
};
export default function TransactionStatus({ status }: Props) {
  let transactionStatusComponent: ReactNode | null = null;

  switch (status) {
    case "success":
      transactionStatusComponent = (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/10">
          موفق
        </span>
      );
      break;
    case "pending":
      transactionStatusComponent = (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
          در حال انجام
        </span>
      );
      break;
    case "failed":
      transactionStatusComponent = (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600">
          ناموفق
        </span>
      );
      break;
    default:
      throw new Error("some thing went wrong");
  }

  return transactionStatusComponent;
}
