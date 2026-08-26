// app/(admin)/admin-project-management/page.tsx
"use client";

import { useState, useCallback } from "react";
import Container from "@/components/ui/Container";
import AdminProjectManagementContent from "@/components/pages/admin/admin-project-management/AdminProjectManagementContent";
import { useAdminProjects } from "@/lib/hooks/useAdmin";
import { AdminProjectFilters } from "@/lib/api/services/admin.service";
import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

export default function Page() {
  const [filters, setFilters] = useState<AdminProjectFilters>({
    page: 1,
    page_size: 10,
  });

  const { data, isLoading } = useAdminProjects(filters);

  // useCallback برای جلوگیری از infinite loop
  const handleFilter = useCallback(
    (formValues: AdminProjectManagementFilterForm) => {
      setFilters((prev) => ({
        ...prev,
        q: formValues.search || undefined,
        status: formValues.status !== "all" ? formValues.status : undefined,
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