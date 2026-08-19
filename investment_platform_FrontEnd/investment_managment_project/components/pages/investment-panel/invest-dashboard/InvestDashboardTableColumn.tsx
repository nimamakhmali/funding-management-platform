import { Column } from "@/components/ui/ReusableTable";
import { InvestDashboardTransactionTableItem } from "@/lib/types/investment-panel/invest-dashboard/InvestDashboardTransactionTable";


export const INVEST_DASHBOARD_TRANSACTION_COLUMNS: Column<InvestDashboardTransactionTableItem >[] = [
  {
    header: "تاریخ",
    accessor: "date",
  },

  {
    header: "نوع تراکنش",

    accessor: (row) => {
      const Icon = row.icon;

      return (
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {row.icon}
          </div>

          <span>{row.title}</span>
        </div>
      );
    },
  },

  {
    header: "مبلغ",
    accessor: "amount",
  },

  {
    header: "وضعیت",

    accessor: (row) => (
      <span className="inline-flex rounded-full bg-primary/10 px-2 py-1 text-xs text-primary">
        موفق
      </span>
    ),
  },
];

