"use client";

import { useMemo, useState } from "react";

import Container from "@/components/ui/Container";

import AdminProjectManagementHeader from "@/components/pages/admin/admin-project-management/AdminProjectManagementHeader";
import AdminProjectManagementFilter from "@/components/pages/admin/admin-project-management/AdminProjectFilterSection";
import AdminProjectTable from "@/components/pages/admin/admin-project-management/AdminProjectTable";

import { adminProjectManagementData } from "@/lib/constants/admin/admin-project-management/AdminProjectTable";

import { AdminProjectManagementFilterForm } from "@/lib/types/admin/admin-poject-management/AdminProjectManagementFilter";

export default function Page() {
  const [filters, setFilters] =
    useState<AdminProjectManagementFilterForm>({
      search: "",
      status: "all",
      owner: "all",
      registerDate: "",
    });

  const filteredProjects = useMemo(() => {
    return adminProjectManagementData.filter((project) => {
      const matchesSearch =
        !filters.search ||
        project.name.includes(filters.search) ||
        project.id.includes(filters.search);

      const matchesStatus =
        filters.status === "all" ||
        project.status === filters.status;

      const matchesOwner =
        filters.owner === "all" ||
        project.owner === filters.owner;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesOwner
      );
    });
  }, [filters]);

  return (
    <Container>
      <AdminProjectManagementHeader />

      <AdminProjectManagementFilter
        onFilterChange={setFilters}
      />

      <AdminProjectTable
        data={filteredProjects}
      />
    </Container>
  );
}