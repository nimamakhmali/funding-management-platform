import { Eye } from "lucide-react";
import { AdminAuditLog } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogTable";

interface Props {
  log: AdminAuditLog;
}

export default function AuditLogTableActions({
  log,
}: Props) {
  return (
    <button
      type="button"
      aria-label={`مشاهده لاگ ${log.id}`}
      className="text-gray-400 transition-colors hover:text-primary"
    >
      <Eye size={18} />
    </button>
  );
}