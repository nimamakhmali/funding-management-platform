// components/pages/investment-panel/invest-dashboard/InvestDashboardCardSection.tsx
"use client";

import DashboardCard from "./InvestDashboardCard";
import {
  useWallet,
  useTransactions,
} from "@/lib/hooks/useInvestorDashboard";

function fmt(val: string | number): string {
  const n = typeof val === "string" ? parseFloat(val) : val;
  if (isNaN(n)) return "۰";
  return n.toLocaleString("fa-IR");
}

export default function DashboardCards() {
  const { data: wallet, isLoading: walletLoading } = useWallet();

  // کل سود دریافتی
  const { data: profitTx } = useTransactions({
    page: 1,
    page_size: 200,
    type: "PROFIT",
    success: true,
  });

  // تعداد سرمایه‌گذاری‌های موفق
  const { data: investTx } = useTransactions({
    page: 1,
    page_size: 1,
    type: "INVESTMENT_COMMITMENT",
    success: true,
  });

  const balance = parseFloat(wallet?.available_balance ?? "0");
  const blocked = parseFloat(wallet?.blocked_amount ?? "0");
  const totalBalance = parseFloat(wallet?.balance ?? "0");

  const totalProfit =
    profitTx?.results?.reduce(
      (sum, tx) => sum + parseFloat(tx.amount),
      0
    ) ?? 0;

  const investCount = investTx?.count ?? 0;

  // درصد موجودی در حال سرمایه‌گذاری از کل
  const blockedPct =
    totalBalance > 0 ? Math.min((blocked / totalBalance) * 100, 100) : 0;

  const cards = [
    {
      title: "موجودی کل",
      value: walletLoading ? "..." : fmt(totalBalance),
      unit: "تومان",
      progress: 100,
      variant: "success" as const,
    },
    {
      title: "در حال سرمایه‌گذاری",
      value: walletLoading ? "..." : fmt(blocked),
      unit: "تومان",
      progress: blockedPct,
      variant: "neutral" as const,
    },
    {
      title: "کل سود دریافتی",
      value: fmt(totalProfit),
      unit: "تومان",
      progress: 70,
      variant: "success" as const,
    },
  ];

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <DashboardCard key={card.title} {...card} />
      ))}
    </section>
  );
}