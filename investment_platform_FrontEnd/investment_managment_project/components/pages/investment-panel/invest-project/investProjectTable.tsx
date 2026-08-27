import { Column } from "@/components/ui/ReusableTable"
import ProjectStatus from "@/components/ui/statusBadge"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import type { MyInvestment } from "@/lib/api/services/investor-dashboard.service"

const STATUS_LABEL: Record<string, string> = {
  PENDING_PAYMENT: "در انتظار پرداخت",
  SUCCESSFUL: "موفق",
  FAILED: "ناموفق",
  REFUNDED: "مسترد شده",
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount)
  if (isNaN(num)) return "—"
  return num.toLocaleString("fa-IR") + " تومان"
}

export const INVEST_PROJECT_COLUMNS: Column<MyInvestment>[] = [
  {
    header: "نام پروژه",
    accessor: "project_title",
    filterable: true,
    filterType: "text",
    cellClassName: "py-4",
  },
  {
    header: "وضعیت",
    accessor: (row) => (
      <ProjectStatus status={STATUS_LABEL[row.status] ?? row.status} />
    ),
    filterable: true,
    filterType: "select",
    filterOptions: [
      { value: "SUCCESSFUL", label: "موفق" },
      { value: "PENDING_PAYMENT", label: "در انتظار پرداخت" },
      { value: "FAILED", label: "ناموفق" },
      { value: "REFUNDED", label: "مسترد شده" },
    ],
  },
  {
    header: "مبلغ سرمایه‌گذاری",
    accessor: (row) => formatAmount(row.amount),
    filterable: true,
    filterType: "number",
  },
  {
    header: "ارزش فعلی",
    accessor: (row) => formatAmount(row.current_value ?? row.amount),
  },
  {
    header: "پیشرفت پروژه",
    accessor: (row) => {
      const pct = parseFloat(row.project_funding_percentage ?? "0")
      return (
        <div className="flex items-center gap-2">
          <Progress value={pct} className="flex-1 h-2" />
          <span className="text-xs text-gray-600 min-w-[45px]">
            {pct.toFixed(0)}%
          </span>
        </div>
      )
    },
  },
  {
    header: "عملیات",
    accessor: (row) => (
      <Link
        href={`/invest-project/${row.project_id}`}
        className="text-primary hover:underline text-sm transition-colors hover:text-primary/80"
      >
        مشاهده جزئیات
      </Link>
    ),
  },
]
