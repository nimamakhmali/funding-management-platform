// components/pages/investProjectTable.tsx
import { Column } from "@/components/ui/ReusableTable"
import ProjectStatus from "@/components/ui/statusBadge"
import { Progress } from "@/components/ui/progress"
import { INVEST_PROJECT_PAGE_TABLES } from "@/lib/constants/InvestProjectPageTable"

type InvestProject = typeof INVEST_PROJECT_PAGE_TABLES[number]

// تابع کمکی برای رنگ بازدهی
const getReturnColor = (returnRate: string) => {
  if (returnRate.startsWith("+")) return "text-green-600"
  if (returnRate.startsWith("-")) return "text-red-600"
  return "text-gray-600"
}

export const INVEST_PROJECT_COLUMNS: Column<InvestProject>[] = [
  { 
    header: "نام پروژه", 
    accessor: "name",
    filterable: true,
    filterType: "text"
  },
  { 
    header: "وضعیت", 
    accessor: (row) => <ProjectStatus status={row.status} />,
    filterable: true,
    filterType: "select",
    filterOptions: [
      { value: "active", label: "فعال" },
      { value: "completed", label: "تکمیل شده" },
      { value: "pending", label: "در انتظار" }
    ]
  },
  { 
    header: "مبلغ سرمایه‌گذاری", 
    accessor: "amount",
    filterable: true,
    filterType: "number"
  },
  { 
    header: "ارزش فعلی", 
    accessor: "currentValue",
    filterable: true,
    filterType: "number"
  },
  { 
    header: "بازدهی", 
    accessor: (row) => (
      <span className={getReturnColor(row.returnRate)}>
        {row.returnRate}
      </span>
    ),
    filterable: true,
    filterType: "number"
  },
  { 
    header: "پیشرفت", 
    accessor: (row) => (
      <div className="flex items-center gap-2">
        <Progress value={row.progress} className="flex-1 h-2" />
        <span className="text-xs text-gray-600 min-w-[45px]">{row.progress}%</span>
      </div>
    ),
  },
  { 
    header: "عملیات", 
    accessor: (row) => (
      <button 
        onClick={() => console.log("view details", row.id)}
        className="text-primary hover:underline text-sm"
      >
        مشاهده جزئیات
      </button>
    ),
  }
]