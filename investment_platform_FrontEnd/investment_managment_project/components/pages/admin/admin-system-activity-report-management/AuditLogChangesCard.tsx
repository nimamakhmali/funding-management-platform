import {
  MinusCircle,
  PlusCircle,
} from "lucide-react";

import { AdminAuditLogDetails } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogDetailsCard";

interface Props {
  details: AdminAuditLogDetails;
}

export default function AuditLogChangesCard({
  details,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-red-600">
          <MinusCircle size={16} />

          <span>مقدار قبل (Before)</span>
        </div>

        <pre
          dir="ltr"
          className="overflow-x-auto rounded-lg border border-red-100 bg-red-50/50 p-3  text-xs text-text-main"
        >
          {details.changes.before}
        </pre>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[11px] font-bold text-amber-600">
          <PlusCircle size={16} />

          <span>مقدار بعد (After)</span>
        </div>

        <pre
          dir="ltr"
          className="overflow-x-auto rounded-lg border border-amber-100 bg-amber-50/50 p-3 font-mono text-xs text-text-main"
        >
          {details.changes.after}
        </pre>
      </div>
    </div>
  );
}