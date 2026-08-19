import { Column } from "@/components/ui/ReusableTable";
import TransactionStatus from "./AdminDashboardTransaction";
import { AdminDashboardTransaction } from "@/lib/types/admin/admin-dashboard/AdminDashboardTransaction";
import { toPersianNumber } from "@/lib/utils/Numberformat";
export const ADMIN_DASHBOARD_TRANSACTION_COLUMNS: Column<AdminDashboardTransaction>[] =
  [
    {
      header: "شناسه",
      accessor: "transactionId",
      filterable: true,
      filterType: "text",
    },

    {
      header: "کاربر",

      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200">
            {row.user.avatar}
          </div>

          <span className="font-semibold text-text-main">
            {row.user.name}
          </span>
        </div>
      ),
    },

    {
      header: "نوع عملیات",
      accessor: "operation",

      filterable: true,
      filterType: "text",
    },

    {
      header: "مبلغ",

      accessor: (row) => (
         <span className="font-semibold">
      {toPersianNumber(row.amount)}
    </span>
      ),

      filterable: true,
      filterType: "number",
    },

    {
      header: "تاریخ",
      accessor: "date",
    },

    {
      header: "وضعیت",

      accessor: (row) => (
        <TransactionStatus status={row.status} />
      ),

      filterable: true,

      filterType: "select",

      filterOptions: [
        {
          value: "completed",
          label: "تکمیل شده",
        },

        {
          value: "pending",
          label: "در انتظار",
        },

        {
          value: "failed",
          label: "ناموفق",
        },
      ],
    },
  ];