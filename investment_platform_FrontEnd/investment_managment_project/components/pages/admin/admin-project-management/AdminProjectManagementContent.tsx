"use client";

import { useMemo } from "react";

import Container from "@/components/ui/Container";

import AdminProjectManagementHeader from "@/components/pages/admin/admin-project-management/AdminProjectManagementHeader";
import AdminProjectManagementFilter from "@/components/pages/admin/admin-project-management/AdminProjectFilterSection";
import AdminProjectTable from "@/components/pages/admin/admin-project-management/AdminProjectTable";

import { AdminProject } from "@/lib/api/services/admin.service";
import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";
import { AdminProjectManagementRow, AdminProjectManagementStatus } from "@/lib/types/admin/admin-poject-management/AdminProjectTable";

interface Props {
  data: AdminProject[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onFilter: (newFilters: AdminProjectManagementFilterForm) => void;
}

function mapStatus(status: string): AdminProjectManagementStatus {
  if (status === "pending" || status === "approved" || status === "rejected") {
    return status;
  }
  return "pending";
}

function mapProject(p: AdminProject): AdminProjectManagementRow {
  return {
    id: p.id,
    name: p.title,
    owner: p.owner.username || p.owner.phone_number,
    category: p.category_display || p.category,
    date: p.created_at,
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
  const filteredProjects = useMemo(() => {
    return data.map(mapProject);
  }, [data]);

  return (
    <Container>
      <AdminProjectManagementHeader />

      <AdminProjectManagementFilter
        onFilterChange={onFilter}
      />

      <AdminProjectTable
        data={filteredProjects}
      />
    </Container>
  );
}
