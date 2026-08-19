"use client";

import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { auditLogData } from "@/lib/constants/admin/admin-system-activity-report-management/AdminAuditLogDataTable";
import { AdminAuditLog } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogTable";
import AuditLogTypeBadge from "./AuditLogTypeBadge";
import AuditLogTableActions from "./AuditLogTableActions";

export default function AdminAuditLogTable() {
  const columns: Column<AdminAuditLog>[] = [
    {
      header: "نوع فعالیت",
      accessor: (row) => (
        <AuditLogTypeBadge
          type={row.type}
        />
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
        <AuditLogTableActions
          log={row}
        />
      ),
      cellClassName: "text-center",
    },
  ];

  return (
    <ReusableTable
      title="تاریخچه فعالیت‌ها"
      data={auditLogData}
      columns={columns}
      enablePagination
      itemsPerPage={2}
    />
  );
}