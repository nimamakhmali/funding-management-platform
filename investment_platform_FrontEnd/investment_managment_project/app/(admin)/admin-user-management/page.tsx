"use client";
import { useState } from "react";
import AdminUserTable from "@/components/pages/admin/admin-user-management/AdminUserTable";
import Container from "@/components/ui/Container";
import AdminUserManagementToolbar from "@/components/pages/admin/admin-user-management/AdminUserManagementToolbar";
import AdminUserManagementHeader from "@/components/pages/admin/admin-user-management/AdminUserManagementHeader";
import { useAdminUsers } from "@/lib/hooks/useAdmin";
import { AdminUserFilters } from "@/lib/api/services/admin.service";

export default function Page() {
  const [filters, setFilters] = useState<AdminUserFilters>({ page: 1, page_size: 10 });
  const { data, isLoading } = useAdminUsers(filters);

  return (
    <Container>
      <AdminUserManagementHeader />
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <AdminUserManagementToolbar
          onSearch={(q) => setFilters((f) => ({ ...f, q, page: 1 }))}
          onRoleFilter={(role) => setFilters((f) => ({ ...f, role, page: 1 }))}
        />
        <AdminUserTable
          data={data?.results ?? []}
          isLoading={isLoading}
          totalPages={data?.total_pages ?? 1}
          currentPage={filters.page ?? 1}
          onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
        />
      </div>
    </Container>
  );
}