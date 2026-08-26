// components/pages/admin/admin-project-management/AdminProjectManagementContent.tsx
"use client";

import { useMemo } from "react";
import AdminProjectManagementHeader from "./AdminProjectManagementHeader";
import AdminProjectManagementFilter from "./AdminProjectFilterSection";
import AdminProjectTable from "./AdminProjectTable";
import { AdminProject } from "@/lib/api/services/admin.service";
import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";
import {
  AdminProjectManagementRow,
  AdminProjectManagementStatus,
} from "@/lib/types/admin/admin-poject-management/AdminProjectTable";

interface Props {
  data: AdminProject[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFilter: (newFilters: AdminProjectManagementFilterForm) => void;
}

// mapping کامل از همه وضعیت‌های بک‌اند
function mapStatus(status: string): AdminProjectManagementStatus {
  const map: Record<string, AdminProjectManagementStatus> = {
    // بک‌اند uppercase
    PENDING_REVIEW: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
    NEEDS_REVISION: "pending",
    DRAFT: "pending",
    FUNDING: "approved",
    FUNDING_COMPLETED: "approved",
    FUNDING_FAILED: "rejected",
    ACTIVE: "approved",
    PROFIT_CALCULATION: "approved",
    PROFIT_DISTRIBUTED: "approved",
    COMPLETED: "approved",
    ARCHIVED: "rejected",
    CANCELED: "rejected",
    // فرانت lowercase (در صورت وجود)
    pending: "pending",
    approved: "approved",
    rejected: "rejected",
  };
  return map[status] ?? "pending";
}

function mapProject(p: AdminProject): AdminProjectManagementRow {
  return {
    id: p.id,
    name: p.title,
    owner: p.owner?.username || p.owner?.phone_number || "—",
    category: p.category_display || p.category || "—",
    date: p.created_at
      ? new Date(p.created_at).toLocaleDateString("fa-IR")
      : "—",
    amount: Number(p.required_budget) || 0,
    status: mapStatus(p.status),
  };
}

export default function AdminProjectManagementContent({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
  onFilter,
}: Props) {
  const tableData = useMemo(() => data.map(mapProject), [data]);

  return (
    // Container را حذف کردیم — page قبلاً Container دارد
    <div className="space-y-6">
      <AdminProjectManagementHeader />

      <AdminProjectManagementFilter onFilterChange={onFilter} />

      <AdminProjectTable
        data={tableData}
        isLoading={isLoading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    </div>
  );
}