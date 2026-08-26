"use client";
import { useState } from "react";
import AdminAuditLogTable from "@/components/pages/admin/admin-system-activity-report-management/AdminAuditLogTable";
import AdminSystemActivityFilterManagement from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityFilterSection";
import AuditLogDetailsCard from "@/components/pages/admin/admin-system-activity-report-management/AuditLogDetailsCard";
import Container from "@/components/ui/Container";
import AdminSystemActivityHeader from "@/components/pages/admin/admin-system-activity-report-management/AdminSystemActivityHeader";
import { useAdminAuditLogs } from "@/lib/hooks/useAdmin";
import { AdminAuditLogFilters } from "@/lib/api/services/admin.service";

export default function Page() {
  const [filters, setFilters] = useState<AdminAuditLogFilters>({ page: 1, page_size: 10 });
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);
  const { data, isLoading } = useAdminAuditLogs(filters);

  const selectedLog = data?.results?.find((l) => l.id === selectedLogId) ?? null;

  const logDetails = selectedLog
    ? {
        id: selectedLog.id,
        changes: {
          before: "",
          after: "",
        },
        actor: {
          name: selectedLog.user
            ? selectedLog.user.full_name || selectedLog.user.phone_number
            : "سیستم",
          role: "",
          ip: selectedLog.ip_address ?? "—",
          browser: "",
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
        onFilter={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
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