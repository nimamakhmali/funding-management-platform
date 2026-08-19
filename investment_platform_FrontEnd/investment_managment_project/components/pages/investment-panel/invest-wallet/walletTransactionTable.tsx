// components/pages/investment-panel/invest-wallet/walletTransactionTable.tsx
"use client";

import { useState } from "react";
import { ReusableTable } from "@/components/ui/ReusableTable";
import ProjectStatus from "@/components/ui/statusBadge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTransactions } from "@/lib/hooks/useInvestorDashboard";
import Link from "next/link";

// ── نگاشت نوع تراکنش بک‌اند → فارسی ─────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  DEPOSIT: "واریز",
  WITHDRAWAL: "برداشت",
  INVESTMENT_COMMITMENT: "سرمایه‌گذاری",
  PROFIT: "سود",
  REFUND: "استرداد",
};

// ── نگاشت وضعیت برای statusBadge ─────────────────────────────────────────────
function txStatus(tx: {
  is_successful: boolean;
  type: string;
}): string {
  if (tx.is_successful) return "موفق";
  if (tx.type === "WITHDRAWAL") return "در انتظار";
  return "ناموفق";
}

export default function WalletTransactionTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const { data, isLoading } = useTransactions({
    page: currentPage,
    page_size: PAGE_SIZE,
  });

  const rows = (data?.results ?? []).map((tx) => ({
    id: tx.id,
    date: new Date(tx.created_at).toLocaleDateString("fa-IR"),
    time: new Date(tx.created_at).toLocaleTimeString("fa-IR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    type: TYPE_LABEL[tx.type] ?? tx.type,
    description: tx.reference_id ?? "-",
    amount: parseFloat(tx.amount),
    status: txStatus(tx),
  }));

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end text-primary">
        <Link href="/transaction-history">
          <Button variant="ghost" size="sm">
            مشاهده همه تراکنش‌ها
            <ArrowLeft />
          </Button>
        </Link>
      </div>

      <ReusableTable
        data={rows}
        columns={[
          {
            header: "تاریخ و زمان",
            cellClassName: "py-4",
            accessor: (row) => `${row.date} ساعت ${row.time}`,
          },
          {
            header: "نوع تراکنش",
            accessor: "type",
          },
          {
            header: "شرح تراکنش",
            accessor: "description",
          },
          {
            header: "مبلغ",
            accessor: (row) =>
              row.amount.toLocaleString("fa-IR") + " تومان",
          },
          {
            header: "وضعیت",
            accessor: (row) => <ProjectStatus status={row.status} />,
          },
        ]}
        title="لیست تراکنش‌ها"
        enablePagination
        itemsPerPage={PAGE_SIZE}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}