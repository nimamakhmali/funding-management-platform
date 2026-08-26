"use client";

import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { AdminAuditLog as AdminAuditLogAPI } from "@/lib/api/services/admin.service";
import { AdminAuditLog, AdminAuditLogType } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogTable";
import AuditLogTypeBadge from "./AuditLogTypeBadge";
import AuditLogTableActions from "./AuditLogTableActions";

interface Props {
  data: AdminAuditLogAPI[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSelectLog: (id: string) => void;
  selectedLogId: string | null;
}

function mapType(type: string): AdminAuditLogType {
  if (type === "balance" || type === "setting" || type === "delete-user") {
    return type;
  }
  return "setting";
}

function mapLog(l: AdminAuditLogAPI, index: number): AdminAuditLog {
  return {
    id: l.id,
    type: mapType(l.action_type),
    description: l.action_type,
    user: {
      id: l.user?.id ?? "",
      name: l.user?.full_name || l.user?.phone_number || "سیستم",
      initials: (l.user?.full_name || l.user?.phone_number || "س").charAt(0),
    },
    createdAt: l.created_at,
  };
}

export default function AdminAuditLogTable({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onSelectLog,
  selectedLogId,
}: Props) {
  const columns: Column<AdminAuditLog>[] = [
    {
      header: "نوع فعالیت",
      accessor: (row) => (
        <AuditLogTypeBadge type={row.type} />
      ),
    },
    {
      header: "شرح",
      accessor: "description",
    },
    {
      header: "انجام دهنده",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {row.user.initials}
          </div>
          <span className="text-sm font-medium text-text-main">
            {row.user.name}
          </span>
        </div>
      ),
    },
    {
      header: "زمان ثبت",
      accessor: "createdAt",
    },
    {
      header: "عملیات",
      accessor: (row) => (
        <AuditLogTableActions log={row} />
      ),
      cellClassName: "text-center",
    },
  ];

  const tableData = data.map(mapLog);

  return (
    <ReusableTable
      title="تاریخچه فعالیت‌ها"
      data={tableData}
      columns={columns}
      enablePagination
      itemsPerPage={10}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
      onRowClick={(row) => onSelectLog(row.id)}
    />
  );
}
