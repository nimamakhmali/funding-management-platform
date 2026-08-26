"use client";
import { useState } from "react";
import AdminTransactionTable from "@/components/pages/admin/admin-transaction-management/AdminTransactionTable";
import Container from "@/components/ui/Container";
import AdminTransactionManagement from "@/components/pages/admin/admin-transaction-management/AdminTransactionFilterSection";
import { useAdminTransactions } from "@/lib/hooks/useAdmin";
import { AdminTransactionFilters } from "@/lib/api/services/admin.service";

export default function Page() {
  const [filters, setFilters] = useState<AdminTransactionFilters>({ page: 1, page_size: 10 });
  const { data, isLoading } = useAdminTransactions(filters);

  return (
    <Container>
      <AdminTransactionManagement
        onFilter={(f) => setFilters((prev) => ({ ...prev, ...f, page: 1 }))}
      />
      <AdminTransactionTable
        data={data?.results ?? []}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </Container>
  );
}