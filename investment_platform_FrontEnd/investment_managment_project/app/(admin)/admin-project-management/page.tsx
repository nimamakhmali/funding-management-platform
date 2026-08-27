"use client";

import { useState, useCallback } from "react";
import Container from "@/components/ui/Container";
import AdminProjectManagementContent from "@/components/pages/admin/admin-project-management/AdminProjectManagementContent";
import { useAdminProjects } from "@/lib/hooks/useAdmin";
import { AdminProjectFilters } from "@/lib/api/services/admin.service";
import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

// mapping وضعیت فرانت → backend
const STATUS_MAP: Record<string, string> = {
  pending: "PENDING_REVIEW",
  approved: "APPROVED",
  rejected: "REJECTED",
};

export default function Page() {
  const [filters, setFilters] = useState<AdminProjectFilters>({
    page: 1,
    page_size: 10,
  });

  const { data, isLoading } = useAdminProjects(filters);

  const handleFilter = useCallback(
    (formValues: AdminProjectManagementFilterForm) => {
      setFilters((prev) => ({
        ...prev,
        q: formValues.search || undefined,
        // mapping وضعیت فرانت → backend
        status:
          formValues.status && formValues.status !== "all"
            ? STATUS_MAP[formValues.status] ?? formValues.status
            : undefined,
        // owner فعلاً filter سمت backend پشتیبانی نمی‌شود (mock بود)
        // date_from هم اضافه می‌شود اگر backend پشتیبانی کند
        page: 1,
      }));
    },
    []
  );

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <Container>
      <AdminProjectManagementContent
        data={data?.results ?? []}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={handlePageChange}
        onFilter={handleFilter}
      />
    </Container>
  );
}