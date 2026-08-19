"use client";

import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { separateThousands } from "@/lib/utils/separateThousands";
import { ReactNode } from "react";
import ProfitReportSwitchStatus from "./ProfitReportSwitchStatus";
import ProfitReportTableAction from "./ProfitReportTableAction";
import { useMyPayouts } from "@/lib/hooks/useProfitReport";
import { InvestorPayout, PayoutStatus } from "@/lib/api/services/profit.service";
import TableSkeleton from "@/components/ui/table-skeleton";

// map وضعیت بک‌اند به فرمت فرانت
function mapStatus(status: PayoutStatus): "pay" | "isPending" {
  return status === "PAID_TO_WALLET" || status === "SETTLED_SEJAM"
    ? "pay"
    : "isPending";
}

// تبدیل تاریخ ISO به فارسی
function toJalali(isoDate: string | null): string {
  if (!isoDate) return "—";
  try {
    return new Date(isoDate).toLocaleDateString("fa-IR");
  } catch {
    return "—";
  }
}

type ProfitReportCol = {
  id: string;
  period: string;
  projectName: string;
  profitPrice: string;
  status: "pay" | "isPending";
  depositDate?: string;
  action: ReactNode;
};

type Props = {
  projectId?: string;
  statusFilter?: PayoutStatus;
};

export default function ProfitReportTable({ projectId, statusFilter }: Props) {
  const { data, isLoading, isError } = useMyPayouts({
    project_id: projectId,
    status: statusFilter,
  });

  const columns: Column<ProfitReportCol>[] = [
    { header: "دوره زمانی", accessor: "period" },
    { header: "نام پروژه", accessor: "projectName" },
    {
      header: "سود دریافتی",
      accessor: (row) => <>{separateThousands(row.profitPrice)} تومان</>,
    },
    {
      header: "وضعیت",
      accessor: (row) => <ProfitReportSwitchStatus status={row.status} />,
    },
    { header: "تاریخ واریز", accessor: "depositDate" },
    {
      header: "عملیات",
      accessor: (row) => <ProfitReportTableAction id={row.id} />,
    },
  ];

  if (isLoading) return <TableSkeleton />;
  
  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-sm text-red-500">
        خطا در دریافت اطلاعات سود
      </div>
    );
  }

  const tableData: ProfitReportCol[] = (data?.results ?? []).map(
    (item: InvestorPayout) => ({
      id: item.id,
      period: item.period_title,
      projectName: item.project_name,
      profitPrice: item.amount,
      status: mapStatus(item.status),
      depositDate: toJalali(item.paid_at),
      action: null,
    })
  );

  return (
    <ReusableTable
      data={tableData}
      columns={columns}
      title=""
      enablePagination
      itemsPerPage={10}
    />
  );
}