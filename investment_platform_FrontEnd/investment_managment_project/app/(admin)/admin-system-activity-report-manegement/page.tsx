"use client";

import { useState, useCallback } from "react";
import AdminAuditLogTable from "@/components/pages/admin/admin-system-activity-report-management/AdminAuditLogTable";
import AdminSystemActivityFilterManagement from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityFilterSection";
import AuditLogDetailsCard from "@/components/pages/admin/admin-system-activity-report-management/AuditLogDetailsCard";
import Container from "@/components/ui/Container";
import AdminSystemActivityHeader from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityHeader";
import { useAdminAuditLogs } from "@/lib/hooks/useAdmin";
import { AdminAuditLogFilters } from "@/lib/api/services/admin.service";
import { AdminAuditLogDetails } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogDetailsCard";
import { AdminSystemActivityManagement } from "@/lib/types/admin/admin-system-activity-report-management/AdminSystemActivityManagement";

export default function Page() {
  const [filters, setFilters] = useState<AdminAuditLogFilters>({
    page: 1,
    page_size: 10,
  });
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const { data, isLoading } = useAdminAuditLogs(filters);

  const selectedLog =
    data?.results?.find((l) => l.id === selectedLogId) ?? null;

  const handleFilter = useCallback(
    (f: AdminSystemActivityManagement) => {
      setFilters((prev) => ({
        ...prev,
        // trim و بررسی "all" و space
        action_type:
          f.adminSystemActivityType &&
          f.adminSystemActivityType.trim() &&
          f.adminSystemActivityType.trim() !== "all" &&
          f.adminSystemActivityType.trim() !== " "
            ? f.adminSystemActivityType.trim()
            : undefined,
        // date range
        date_from:
          f.dateRange && f.dateRange.trim() && f.dateRange.trim() !== " "
            ? f.dateRange.trim()
            : undefined,
        page: 1,
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  const logDetails: AdminAuditLogDetails | null = selectedLog
    ? {
        id: selectedLog.id,
        changes: {
          before: JSON.stringify(
            selectedLog.details?.before ?? {},
            null,
            2
          ),
          after: JSON.stringify(
            selectedLog.details?.after ?? {},
            null,
            2
          ),
        },
        actor: {
          name:
            selectedLog.user?.full_name ||
            selectedLog.user?.phone_number ||
            "سیستم",
          role: "مدیر",
          ip: selectedLog.ip_address ?? "—",
          browser: "—",
        },
        metadata: {
          module: selectedLog.action_type,
          time: selectedLog.created_at
            ? new Date(selectedLog.created_at).toLocaleDateString("fa-IR")
            : "—",
        },
      }
    : null;

  return (
    <Container>
      <AdminSystemActivityHeader />
      <AdminSystemActivityFilterManagement onFilter={handleFilter} />
      <AdminAuditLogTable
        data={data?.results ?? []}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={handlePageChange}
        onSelectLog={setSelectedLogId}
        selectedLogId={selectedLogId}
      />
      {logDetails && <AuditLogDetailsCard details={logDetails} />}
    </Container>
  );
}