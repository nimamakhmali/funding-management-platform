import { Column } from "@/components/ui/ReusableTable";
import { Report } from "@/lib/types/project-owner-panel/reports/ReportTable";

export const reportColumns: Column<Report>[] = [
  {
    header: "نام پروژه",
    accessor: "projectName",
    cellClassName: "p-4"
  },

  {
    header: "تاریخ شروع",
    accessor: "startDate",
  },

  {
    header: "مبلغ هدف",
    accessor: "targetAmount",
  },

  {
    header: "مبلغ جذب‌شده",
    accessor: "raisedAmount",
  },

  {
    header: "درصد تامین",
    accessor: (row) => (
      <div className="flex items-center gap-2">
        <span>{row.progress}%</span>

        <div className="w-24 h-2 rounded bg-gray-200">
          <div
            className="h-full rounded bg-primary"
            style={{
              width: `${row.progress}%`,
            }}
          />
        </div>
      </div>
    ),
  },

  {
    header: "وضعیت",
    accessor: (row) => {
      const color = {
        فعال: "bg-blue-50 text-blue-700",
        "تکمیل شده": "bg-purple-50 text-purple-700",
        اولیه: "bg-orange-50 text-orange-700",
      };

      return (
        <span
          className={`px-2 py-1 rounded-md text-xs ${color[row.status]}`}
        >
          {row.status}
        </span>
      );
    },
  },
];