"use client";

import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { AdminProfitPeriod } from "@/lib/api/services/admin.service";
import {
  AdminProfitTableRow,
  AdminProfitCalculationStatus,
  AdminProfitApproveStatus,
} from "@/lib/types/admin/admin-profit-management/AdminProfitTable";

import ProfitCalculationStatusBadge from "./ProfitCalculationStatusBadge";
import ProfitApproveStatusBadge from "./ProfitApproveStatusBadge";
import ProfitTableActions from "./ProfitTableActions";

interface Props {
  data: AdminProfitPeriod[];
  isLoading: boolean;
}

function mapCalculationStatus(status: string): AdminProfitCalculationStatus {
  if (status === "CALCULATED" || status === "COMPLETED") return "calculated";
  return "processing";
}

function mapApproveStatus(status: string): AdminProfitApproveStatus {
  if (status === "APPROVED") return "approved";
  if (status === "PENDING") return "pending";
  return "unknown";
}

function mapPeriod(p: AdminProfitPeriod): AdminProfitTableRow {
  return {
    id: p.id,
    title: p.title,
    period: p.calculation_date,
    amount: Number(p.total_profit_amount) || 0,
    investors: p.payout_items_count ?? 0,
    calculationStatus: mapCalculationStatus(p.status),
    approveStatus: mapApproveStatus(p.status),
  };
}

export default function AdminProfitTable({ data, isLoading }: Props) {
  const columns: Column<AdminProfitTableRow>[] = [
    {
      header: "نام دوره",
      accessor: "title",
      cellClassName: "p-4",
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
        <ProfitCalculationStatusBadge status={row.calculationStatus} />
      ),
    },
    {
      header: "وضعیت تایید",
      accessor: (row) => (
        <ProfitApproveStatusBadge status={row.approveStatus} />
      ),
    },
    {
      header: "اقدامات",
      accessor: (row) => <ProfitTableActions profit={row} />,
      cellClassName: "text-center",
    },
  ];

  const tableData = data.map(mapPeriod);

  return (
    <ReusableTable
      title="جدول دوره‌های سود"
      data={tableData}
      columns={columns}
      enablePagination
      enableFilter
      itemsPerPage={2}
      isLoading={isLoading}
    />
  );
}
