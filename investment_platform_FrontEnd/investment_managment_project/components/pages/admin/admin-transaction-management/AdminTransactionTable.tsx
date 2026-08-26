"use client";
import { Column, ReusableTable } from "@/components/ui/ReusableTable";
import { AdminTransaction as AdminTransactionAPI } from "@/lib/api/services/admin.service";
import { AdminTransaction, AdminTransactionStatus } from "@/lib/types/admin/admin-transaction-management/AdminTransaction-types";
import TransactionTableActions from "./AdminTransactionTableActions";
import AdminTransactionStatusBadge from "./AdminTransactionStatusBadge";

interface Props {
  data: AdminTransactionAPI[];
  isLoading: boolean;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function mapStatus(status: string): AdminTransactionStatus {
  if (status === "success" || status === "pending" || status === "failed") {
    return status;
  }
  return "pending";
}

function mapTransaction(t: AdminTransactionAPI): AdminTransaction {
  return {
    id: t.id,
    user: {
      name: t.user.name,
      initials: t.user.initials,
    },
    type: t.type_display || t.type,
    amount: Number(t.amount) || 0,
    status: mapStatus(t.is_successful ? "success" : "pending"),
    date: t.created_at,
  };
}

export default function AdminTransactionTable({
  data,
  isLoading,
  totalPages,
  currentPage,
  onPageChange,
}: Props) {
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
    },
  ];

  const tableData = data.map(mapTransaction);

  return (
    <ReusableTable
      title="تراکنش‌ها"
      data={tableData}
      columns={columns}
      enableFilter
      enablePagination
      itemsPerPage={10}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={onPageChange}
    />
  );
}
