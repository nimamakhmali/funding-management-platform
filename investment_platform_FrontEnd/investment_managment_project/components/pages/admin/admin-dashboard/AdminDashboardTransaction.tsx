import { cn } from "@/lib/utils";
import { TransactionStatus as TransactionStatusType } from "@/lib/types/admin/admin-dashboard/AdminDashboardTransaction";

type TransactionStatusProps = {
  status: TransactionStatusType;
};

const STATUS_CONFIG = {
  completed: {
    label: "تکمیل شده",
    className: "bg-blue-50 text-blue-700",
  },

  pending: {
    label: "در انتظار",
    className: "bg-yellow-50 text-yellow-700",
  },

  failed: {
    label: "ناموفق",
    className: "bg-red-50 text-red-700",
  },
} satisfies Record<
  TransactionStatusType,
  {
    label: string;
    className: string;
  }
>;

export default function TransactionStatus({
  status,
}: TransactionStatusProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}