import { Badge } from "@/components/ui/badge";
import { AdminTransaction } from "@/lib/types/admin/admin-transaction-management/AdminTransaction-types";

interface Props {
  status: AdminTransaction["status"];
}

const STATUS_CONFIG: Record<
  AdminTransaction["status"],
  {
    label: string;
    className: string;
  }
> = {
  success: {
    label: "موفق",
    className: "bg-primary/20 text-primary border border-primary/30",
  },

  pending: {
    label: "در حال بررسی",
    className: "bg-slate-100 text-slate-500 border border-slate-200",
  },

  failed: {
    label: "ناموفق",
    className: "bg-slate-200/50 text-slate-400 border border-slate-300",
  },
};

export default function AdminTransactionStatusBadge({
  status,
}: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge
      className={`px-3 py-1 text-[11px] font-bold ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}