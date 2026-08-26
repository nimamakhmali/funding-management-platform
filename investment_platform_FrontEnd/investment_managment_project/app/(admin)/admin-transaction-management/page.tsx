// app/(admin)/admin-transaction-management/page.tsx
"use client";

import { useState, useCallback } from "react";
import AdminTransactionTable from "@/components/pages/admin/admin-transaction-management/AdminTransactionTable";
import Container from "@/components/ui/Container";
import AdminTransactionManagement from "@/components/pages/admin/admin-transaction-management/AdminTransactionFilterSection";
import { useAdminTransactions } from "@/lib/hooks/useAdmin";
import { AdminTransactionFilters } from "@/lib/api/services/admin.service";
import { AdminTransactionFilterFormValues } from "@/lib/types/admin/admin-transaction-management/AdminTransactionFilterFormValues-types";

export default function Page() {
  const [filters, setFilters] = useState<AdminTransactionFilters>({
    page: 1,
    page_size: 10,
  });

  const { data, isLoading } = useAdminTransactions(filters);

  const handleFilter = useCallback((f: AdminTransactionFilterFormValues) => {
    setFilters((prev) => ({
      ...prev,
      type: f.transaction !== "all" ? f.transaction : undefined,
      min_amount: f.minPrice ?? undefined,
      max_amount: f.maxPrice ?? undefined,
      date_from: f.dateRange || undefined,
      page: 1,
    }));
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  }, []);

  return (
    <Container>
      <AdminTransactionManagement onFilter={handleFilter} />
      <AdminTransactionTable
        data={data?.results ?? []}
        isLoading={isLoading}
        totalPages={data?.total_pages ?? 1}
        currentPage={filters.page ?? 1}
        onPageChange={handlePageChange}
      />
    </Container>
  );
}