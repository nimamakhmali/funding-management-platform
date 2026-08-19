import { AdminAuditLogDetails } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogDetailsCard";

interface Props {
  details: AdminAuditLogDetails;
}

export default function AuditLogInfoCard({
  details,
}: Props) {
  return (
    <div className="space-y-3">
      <InfoRow
        label="انجام دهنده:"
        value={`${details.actor.name} (${details.actor.role})`}
      />

      <InfoRow
        label="آدرس IP:"
        value={details.actor.ip}
    
      />

      <InfoRow
        label="دستگاه / مرورگر:"
        value={details.actor.browser}
      />

      <InfoRow
        label="ماژول منبع:"
        value={details.metadata.module}
        valueClassName="text-primary"
      />

      <InfoRow
        label="زمان دقیق:"
        value={details.metadata.time}
       
      />
    </div>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  valueClassName?: string;
}

function InfoRow({
  label,
  value,
  valueClassName = "",
}: InfoRowProps) {
  return (
    <div className="flex items-center justify-between border-b border-gray-100 py-2">
      <span className="text-xs font-medium text-gray-500">
        {label}
      </span>

      <span
        className={`text-xs font-bold 
         ${valueClassName}`}
      >
        {value}
      </span>
    </div>
  );
}