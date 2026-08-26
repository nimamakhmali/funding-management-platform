"use client";
import { Column, ReusableTable } from "@/components/ui/ReusableTable";

import { AdminProjectManagementRow } from "@/lib/types/admin/admin-poject-management/AdminProjectTable";
import AdminProjectManagementStatusBadge from "./StatusBadge";
import AdminProjectManagementCategoryBadge from "./CategoryBadge";
import AdminProjectManagementActions from "./ProjectActions";

type Props = {
  data: AdminProjectManagementRow[];
  isLoading?: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
};

export default function AdminProjectTable({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
  const columns: Column<AdminProjectManagementRow>[] = [
    { header: "نام پروژه", accessor: "name" },
    { header: "مالک", accessor: "owner" },
    {
      header: "دسته‌بندی",
      accessor: (row) => (
        <AdminProjectManagementCategoryBadge category={row.category} />
      ),
    },
    { header: "تاریخ ثبت", accessor: "date" },
    {
      header: "هدف تأمین مالی",
      accessor: (row) => (
        <>
          {row.amount.toLocaleString("fa-IR")}
        </>
      ),
    },
    {
      header: "وضعیت",
      accessor: (row) => (
        <AdminProjectManagementStatusBadge status={row.status} />
      ),
    },
    {
      header: "عملیات",
      accessor: (row) => (
        <AdminProjectManagementActions project={row} />
      ),
    },
  ];

  return (
    <ReusableTable
      data={data}
      columns={columns}
      enablePagination
      itemsPerPage={10}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
