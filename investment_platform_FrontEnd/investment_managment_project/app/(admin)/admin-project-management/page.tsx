"use client";
import { useState } from "react";
import Container from "@/components/ui/Container";
import AdminProjectManagementContent from "@/components/pages/admin/admin-project-management/AdminProjectManagementContent";
import { useAdminProjects } from "@/lib/hooks/useAdmin";
import { AdminProjectFilters } from "@/lib/api/services/admin.service";

export default function Page() {
  const [filters, setFilters] = useState<AdminProjectFilters>({ page: 1, page_size: 10 });
  const { data, isLoading } = useAdminProjects(filters);

  return (
    <Container>
      <AdminProjectManagementContent
        data={data?.results ?? []}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        onFilter={(newFilters) => setFilters((f) => ({ ...f, ...newFilters, page: 1 }))}
      />
    </Container>
  );
}