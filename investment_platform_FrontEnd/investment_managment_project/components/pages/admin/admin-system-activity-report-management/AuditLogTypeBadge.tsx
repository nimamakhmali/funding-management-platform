import { Badge } from "@/components/ui/badge";
import { AdminAuditLogType } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogTable";

interface Props {
  type: AdminAuditLogType;
}

const TYPE_CONFIG: Record<
  AdminAuditLogType,
  {
    label: string;
    className: string;
  }
> = {
  balance: {
    label: "تغییر موجودی",
    className:
      "bg-primary-50 text-primary border border-primary-100",
  },

  setting: {
    label: "تغییر تنظیمات",
    className:
      "bg-amber-50 text-amber-700 border border-amber-100",
  },

  "delete-user": {
    label: "حذف کاربر",
    className:
      "bg-red-50 text-red-700 border border-red-100",
  },
};

export default function AuditLogTypeBadge({
  type,
}: Props) {
  const config = TYPE_CONFIG[type];

  return (
    <Badge
      className={`px-3 py-1 text-[11px] font-bold ${config.className}`}
    >
      {config.label}
    </Badge>
  );
}