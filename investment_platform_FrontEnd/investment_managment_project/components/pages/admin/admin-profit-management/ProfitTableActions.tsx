import { Ellipsis, Eye } from "lucide-react";
import { AdminProfitTableRow } from "@/lib/types/admin/admin-profit-management/AdminProfitTable";

interface Props {
  profit: AdminProfitTableRow;
}

export default function ProfitTableActions({ profit }: Props) {
  if (profit.calculationStatus === "processing") {
    return (
      <button className="text-gray-400 transition-colors hover:text-primary">
        <Ellipsis size={18} />
      </button>
    );
  }

  if (profit.approveStatus === "pending") {
    return (
      <button className="rounded-lg border border-primary/20 px-3 py-1 text-[11px] font-bold text-primary transition-all hover:bg-primary hover:text-white">
        تایید فوری
      </button>
    );
  }

  return (
    <button className="text-gray-400 transition-colors hover:text-primary">
      <Eye size={18} />
    </button>
  );
}