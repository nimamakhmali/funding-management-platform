import { AdminProfitApproveStatus } from "@/lib/types/admin/admin-profit-management/AdminProfitTable";

interface Props {
  status: AdminProfitApproveStatus;
}

const STATUS_CONFIG: Record<
  AdminProfitApproveStatus,
  {
    label: string;
    className: string;
  }
> = {
  approved: {
    label: "تایید شده",
    className: "bg-indigo-100 text-indigo-700",
  },
  pending: {
    label: "در انتظار تایید",
    className: "bg-gray-100 text-gray-600",
  },
  unknown: {
    label: "نامشخص",
    className: "bg-gray-50 text-gray-400",
  },
};

export default function ProfitApproveStatusBadge({
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