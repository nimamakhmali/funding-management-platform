"use client";

import { Column, ReusableTable } from "@/components/ui/ReusableTable";

import { profitTableData } from "@/lib/constants/admin/admin-profit-management/ProfitTableData";
import { AdminProfitTableRow } from "@/lib/types/admin/admin-profit-management/AdminProfitTable";

import ProfitCalculationStatusBadge from "./ProfitCalculationStatusBadge";
import ProfitApproveStatusBadge from "./ProfitApproveStatusBadge";
import ProfitTableActions from "./ProfitTableActions";

export default function AdminProfitTable() {
  const columns: Column<AdminProfitTableRow>[] = [
    {
      header: "نام دوره",
      accessor: "title",
      cellClassName: "p-4"
    },
    {
      header: "بازه زمانی",
      accessor: "period",
    },
    {
      header: "مجموع سود توزیع شده",
      accessor: (row) => row.amount.toLocaleString("fa-IR"),
    },
    {
      header: "تعداد سرمایه‌گذاران",
      accessor: (row) => `${row.investors.toLocaleString("fa-IR")} نفر`,
    },
    {
      header: "وضعیت محاسبه",
      accessor: (row) => (
        <ProfitCalculationStatusBadge
          status={row.calculationStatus}
        />
      ),
    },
    {
      header: "وضعیت تایید",
      accessor: (row) => (
        <ProfitApproveStatusBadge
          status={row.approveStatus}
        />
      ),
    },
    {
      header: "اقدامات",
      accessor: (row) => (
        <ProfitTableActions
          profit={row}
        />
      ),
      cellClassName: "text-center",
    },
  ];

  return (
    <ReusableTable
      title="جدول دوره‌های سود"
      data={profitTableData}
      columns={columns}
      enablePagination
      enableFilter
      itemsPerPage={2}
    />
  );
}