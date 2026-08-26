// app/(admin)/admin-user-management/page.tsx
"use client";

import { useState, useCallback } from "react";
import AdminUserTable from "@/components/pages/admin/admin-user-management/AdminUserTable";
import Container from "@/components/ui/Container";
import AdminUserManagementToolbar from "@/components/pages/admin/admin-user-management/AdminUserManagementToolbar";
import AdminUserManagementHeader from "@/components/pages/admin/admin-user-management/AdminUserManagementHeader";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { AdminUserFilters } from "@/lib/api/services/admin.service";

export default function Page() {
  const [filters, setFilters] = useState<AdminUserFilters>({
    page: 1,
    page_size: 10,
  });

  const { data, isLoading } = useAdminUsers(filters);

  // useCallback — مانع ساخته شدن تابع جدید در هر render
  const handleSearch = useCallback((q: string) => {
    setFilters((prev) => ({ ...prev, q: q || undefined, page: 1 }));
  }, []);

  const handleRoleFilter = useCallback((role: string) => {
    setFilters((prev) => ({ ...prev, role: role || undefined, page: 1 }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <Container>
      <AdminUserManagementHeader />
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <AdminUserManagementToolbar
          onSearch={handleSearch}
          onRoleFilter={handleRoleFilter}
        />
        <AdminUserTable
          data={data?.results ?? []}
          isLoading={isLoading}
          totalPages={data?.total_pages ?? 1}
          currentPage={filters.page ?? 1}
          onPageChange={handlePageChange}
        />
      </div>
    </Container>
  );
}