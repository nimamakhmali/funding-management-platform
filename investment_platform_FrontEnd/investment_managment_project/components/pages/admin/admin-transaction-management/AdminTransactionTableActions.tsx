import { Eye } from "lucide-react";

import { AdminTransaction } from "@/lib/types/admin/admin-transaction-management/AdminTransaction-types";

interface TransactionTableActionsProps {
  transaction: AdminTransaction;
}

export default function TransactionTableActions({
  transaction,
}: TransactionTableActionsProps) {
  return (
    <button
      type="button"
      className="text-slate-400 hover:text-primary transition-colors"
      onClick={() => {
        console.log(transaction);
      }}
    >
      <Eye size={18} />
    </button>
  );
}