// components/pages/investment-panel/invest-dashboard/InvestDashboardTable.tsx
"use client";

import { ReusableTable } from "@/components/ui/ReusableTable";
import ProjectStatus from "@/components/ui/statusBadge";
import { useTransactions } from "@/lib/hooks/useInvestorDashboard";

// ── نگاشت نوع تراکنش → فارسی ─────────────────────────────────────────────────
const TYPE_LABEL: Record<string, string> = {
  DEPOSIT: "واریز به کیف پول",
  WITHDRAWAL: "برداشت از کیف پول",
  INVESTMENT_COMMITMENT: "سرمایه‌گذاری",
  PROFIT: "واریز سود",
  REFUND: "استرداد وجه",
};

function txStatus(is_successful: boolean, type: string): string {
  if (is_successful) return "موفق";
  if (type === "WITHDRAWAL") return "در انتظار";
  return "ناموفق";
}

function formatAmount(amount: string): string {
  const num = parseFloat(amount);
  if (isNaN(num)) return "-";
  return num.toLocaleString("fa-IR") + " تومان";
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("fa-IR");
}

export default function InvestDashboardTable() {
  // فقط ۵ تراکنش اخیر برای داشبورد
  const { data, isLoading } = useTransactions({
    page: 1,
    page_size: 5,
  });

  const rows = (data?.results ?? []).map((tx) => ({
    id: tx.id,
    date: formatDate(tx.created_at),
    title: TYPE_LABEL[tx.type] ?? tx.type,
    amount: formatAmount(tx.amount),
    status: txStatus(tx.is_successful, tx.type),
  }));

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-3 mt-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <ReusableTable
      title="تراکنش‌های اخیر"
      data={rows}
      columns={[
        {
          header: "تاریخ",
          accessor: "date",
          cellClassName: "py-4",
        },
        {
          header: "عنوان تراکنش",
          accessor: "title",
        },
        {
          header: "مبلغ",
          accessor: "amount",
        },
        {
          header: "وضعیت",
          accessor: (row) => <ProjectStatus status={row.status} />,
        },
      ]}
      enablePagination={false}
    />
  );
}