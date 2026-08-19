import { AdminProjectManagementStatus } from "@/lib/types/admin/admin-poject-management/AdminProjectTable";
type Props = {
  status: AdminProjectManagementStatus;
};

const statusMap = {
  pending: {
    text: "در حال بررسی",
    className:
      "bg-orange-50 text-orange-700 ring-1 ring-orange-200/50",
    dot: "bg-orange-500 animate-pulse",
  },
  approved: {
    text: "تأیید شده",
    className:
      "bg-primary/10 text-primary ring-1 ring-primary/20",
    dot: "bg-primary",
  },
  rejected: {
    text: "رد شده",
    className:
      "bg-red-50 text-red-700 ring-1 ring-red-200/50",
    dot: "bg-red-500",
  },
};

export default function AdminProjectManagementStatusBadge({ status }: Props) {
  const item = statusMap[status];

  return (
    <div className="flex justify-center">
      <span
        className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-black min-w-[115px] justify-center ${item.className}`}
      >
        <span className={`size-1.5 rounded-full ${item.dot}`} />
        {item.text}
      </span>
    </div>
  );
}