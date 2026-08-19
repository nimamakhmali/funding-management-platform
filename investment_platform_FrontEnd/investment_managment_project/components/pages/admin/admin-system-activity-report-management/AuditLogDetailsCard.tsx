import { Printer, TrendingUp } from "lucide-react";
import { AdminAuditLogDetails } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogDetailsCard";
import AuditLogChangesCard from "./AuditLogChangesCard";
import AuditLogInfoCard from "./AuditLogInfoCard";

interface Props {
  details: AdminAuditLogDetails;
}

export default function AuditLogDetailsCard({
  details,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-md">
      <div className="flex items-center justify-between border-b border-gray-100 bg-background-light p-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={18} />

          <span className="text-sm font-bold">
            جزئیات رویداد
          </span>
        </div>

        <span className="rounded bg-primary-100 px-2 py-0.5 text-[10px] font-bold text-primary">
          شناسه: #{details.id}
        </span>
      </div>

      <div className="space-y-6 p-5">
        <AuditLogChangesCard
          details={details}
        />

        <div className="border-t border-t-gray-100" ></div>

        <AuditLogInfoCard
          details={details}
        />

        <button
  type="button"
  className="mx-auto flex items-center justify-center gap-2 rounded-lg border bg-primary px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-primary"
>
  <Printer size={16} />
  خروجی PDF این گزارش
</button>
      </div>
    </div>
  );
}