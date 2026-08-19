"use client";
import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { transactionTableData } from "@/lib/constants/admin/admin-transaction-management/AdminTransaction";
import { AdminTransaction } from "@/lib/types/admin/admin-transaction-management/AdminTransaction-types";
import TransactionTableActions from "./AdminTransactionTableActions";
import AdminTransactionStatusBadge from "./AdminTransactionStatusBadge";

export default function AdminTransactionTable() {
  const columns: Column<AdminTransaction>[] = [
    {
      header: "شناسه تراکنش",
      accessor: "id",
    },

    {
      header: "کاربر",
      accessor: (row) => (
        <div className="flex items-center gap-2">
          <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
            {row.user.initials}
          </div>

          <span className="text-sm font-bold text-slate-800">
            {row.user.name}
          </span>
        </div>
      ),
    },

    {
      header: "نوع",
      accessor: "type",
    },

    {
      header: "مبلغ (تومان)",
      accessor: (row) => row.amount.toLocaleString("fa-IR"),
    },
{
  header: "وضعیت",
  accessor: (row) => (
    <AdminTransactionStatusBadge
      status={row.status}
    />
  ),
},

    {
      header: "تاریخ و زمان",
      accessor: "date",
    },

   {
  header: "عملیات",

  accessor: (row) => (
    <TransactionTableActions
      transaction={row}
    />
  ),

  cellClassName: "text-center",
}
  ];

  return (
    <ReusableTable
      title="تراکنش‌ها"
      data={transactionTableData}
      columns={columns}
      enableFilter
      enablePagination
      itemsPerPage={10}
    />
  );
}