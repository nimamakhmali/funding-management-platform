// app/(admin)/admin-system-activity-report-manegement/page.tsx
"use client";

import { useState } from "react";
import AdminAuditLogTable from "@/components/pages/admin/admin-system-activity-report-management/AdminAuditLogTable";
import AdminSystemActivityFilterManagement from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityFilterSection";
import AuditLogDetailsCard from "@/components/pages/admin/admin-system-activity-report-management/AuditLogDetailsCard";
import Container from "@/components/ui/Container";
import AdminSystemActivityHeader from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityHeader";
import { useAdminAuditLogs } from "@/lib/hooks/useAdmin";
import { AdminAuditLogFilters } from "@/lib/api/services/admin.service";
import { AdminAuditLogDetails } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogDetailsCard";

export default function Page() {
  const [filters, setFilters] = useState<AdminAuditLogFilters>({
    page: 1,
    page_size: 10,
  });
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { data, isLoading } = useAdminAuditLogs(filters);

  const selectedLog = data?.results?.find((l) => l.id === selectedLogId) ?? null;

  // mapping بک‌اند → AdminAuditLogDetails
  const logDetails: AdminAuditLogDetails | null = selectedLog
    ? {
        id: selectedLog.id,
        changes: {
          before: JSON.stringify(selectedLog.details?.before ?? {}, null, 2),
          after: JSON.stringify(selectedLog.details?.after ?? {}, null, 2),
        },
        actor: {
          name: selectedLog.user?.full_name || selectedLog.user?.phone_number || "سیستم",
          role: "مدیر",
          ip: selectedLog.ip_address ?? "—",
          browser: "—",
        },
        metadata: {
          module: selectedLog.action_type,
          time: selectedLog.created_at,
        },
      }
    : null;

  return (
    <Container>
      <AdminSystemActivityHeader />
      <AdminSystemActivityFilterManagement
        onFilter={(f) =>
          setFilters((prev) => ({
            ...prev,
            action_type:
              f.adminSystemActivityType?.trim() &&
              f.adminSystemActivityType.trim() !== " "
                ? f.adminSystemActivityType.trim()
                : undefined,
            page: 1,
          }))
        }
      />
      <AdminAuditLogTable
        data={data?.results ?? []}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onSelectLog={setSelectedLogId}
        selectedLogId={selectedLogId}
      />
      {logDetails && <AuditLogDetailsCard details={logDetails} />}
    </Container>
  );
}