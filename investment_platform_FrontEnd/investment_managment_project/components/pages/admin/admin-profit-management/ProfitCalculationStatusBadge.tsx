import { AdminProfitCalculationStatus } from "@/lib/types/admin/admin-profit-management/AdminProfitTable";

interface Props {
  status: AdminProfitCalculationStatus;
}

const STATUS_CONFIG: Record<
  AdminProfitCalculationStatus,
  {
    label: string;
    className: string;
  }
> = {
  calculated: {
    label: "محاسبه شده",
    className: "bg-primary/10 text-primary",
  },
  processing: {
    label: "در حال محاسبه...",
    className: "bg-gray-100 text-gray-400 italic",
  },
};

export default function ProfitCalculationStatusBadge({
  status,
}: Props) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold ${config.className}`}
    >
      {config.label}
    </span>
  );
}