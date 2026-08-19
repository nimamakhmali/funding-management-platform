import { ReusableTable } from "@/components/ui/ReusableTable";
import { ADMIN_DASHBOARD_TRANSACTION_COLUMNS } from "./AdminDashboardTransactionColumnsTable";
import { ADMIN_DASHBOARD_TRANSACTIONS } from "@/lib/constants/admin/admin-dashboard/AdminDashboardTransactions";

export default function AdminDashboardTransactionTable() {
  return (
    <ReusableTable
      title="تراکنش‌های اخیر"
      columns={ADMIN_DASHBOARD_TRANSACTION_COLUMNS}
      data={ADMIN_DASHBOARD_TRANSACTIONS}
      enableFilter
      enableSort
      enablePagination
      itemsPerPage={5}
    />
  );
}