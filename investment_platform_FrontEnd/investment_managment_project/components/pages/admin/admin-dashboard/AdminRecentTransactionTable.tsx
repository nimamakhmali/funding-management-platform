// components/pages/admin/admin-dashboard/AdminRecentTransactionTable.tsx
"use client";

import { ReusableTable } from "@/components/ui/ReusableTable";
import { Column } from "@/components/ui/ReusableTable";
import { useAdminRecentTransactions } from "@/lib/hooks/useAdmin";
import { AdminRecentTransaction } from "@/lib/api/services/admin.service";
import TransactionStatus from "./AdminDashboardTransaction";
import { TransactionStatus as TransactionStatusType } from "@/lib/types/admin/admin-dashboard/AdminDashboardTransaction";

function mapStatus(isSuccessful: boolean): TransactionStatusType {
  return isSuccessful ? "completed" : "failed";
}

type TableRow = {
  id: string;
  transactionId: string;
  userName: string;
  type: string;
  amount: number;
  date: string;
  status: TransactionStatusType;
};

const COLUMNS: Column<TableRow>[] = [
  { header: "شناسه تراکنش", accessor: "transactionId" },
  { header: "کاربر", accessor: "userName" },
  { header: "نوع عملیات", accessor: "type" },
  {
    header: "مبلغ (تومان)",
    accessor: (row) => Number(row.amount).toLocaleString("fa-IR"),
  },
  { header: "تاریخ", accessor: "date" },
  {
    header: "وضعیت",
    accessor: (row) => <TransactionStatus status={row.status} />,
  },
];

export default function AdminDashboardTransactionTable() {
  const { data: transactions, isLoading } = useAdminRecentTransactions();

  const tableData: TableRow[] = (transactions ?? []).map((tx) => ({
    id: tx.id,
    transactionId: tx.reference_id || `TRX-${tx.id.slice(0, 6).toUpperCase()}`,
    userName: tx.user.name,
    type: tx.type_display || tx.type,
    amount: Number(tx.amount),
    date: tx.created_at,
    status: mapStatus(tx.is_successful),
  }));

  return (
    <ReusableTable
      title="تراکنش‌های اخیر"
      columns={COLUMNS}
      data={tableData}
      isLoading={isLoading}
      enableFilter
      enableSort
      enablePagination
      itemsPerPage={5}
      emptyMessage="هیچ تراکنشی یافت نشد"
    />
  );
}