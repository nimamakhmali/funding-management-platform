// app/(investment-panel)/invest-dashboard/page.tsx
"use client";

import { useMemo } from "react";
import DashboardCards from "@/components/pages/investment-panel/invest-dashboard/InvestDashboardCardSection";
import Container from "@/components/ui/Container";
import PortfolioPerformanceChart from "@/components/pages/investment-panel/invest-dashboard/PortfolioPerformanceChart";
import InvestDashboardTable from "@/components/pages/investment-panel/invest-dashboard/InvestDashboardTable";
import { useTransactions } from "@/lib/hooks/useInvestorDashboard";
import { portfolioChartData } from "@/lib/constants/invetment-panel/invest-dashboard/portfolioChart";
import type { PortfolioChartPoint } from "@/lib/types/investment-panel/invest-dashboard/investChart";

// ── تبدیل تراکنش‌های INVESTMENT به داده نمودار ماهانه ────────────────────────
function buildChartData(
  results: Array<{
    created_at: string;
    amount: string;
    type: string;
    is_successful: boolean;
  }>
): PortfolioChartPoint[] {
  // فقط سرمایه‌گذاری‌های موفق
  const investments = results.filter(
    (tx) =>
      tx.type === "INVESTMENT_COMMITMENT" && tx.is_successful
  );

  if (investments.length === 0) return [];

  // گروه‌بندی بر اساس ماه شمسی
  const monthMap = new Map<string, number>();

  investments.forEach((tx) => {
    const date = new Date(tx.created_at);
    const month = date.toLocaleDateString("fa-IR", { month: "long" });
    const current = monthMap.get(month) ?? 0;
    monthMap.set(month, current + parseFloat(tx.amount));
  });

  // تبدیل به آرایه مرتب‌شده
  return Array.from(monthMap.entries()).map(([month, value]) => ({
    month,
    value,
  }));
}

export default function Page() {
  // دریافت ۱۰۰ تراکنش اخیر برای رسم نمودار
  const { data: txData, isLoading } = useTransactions({
    page: 1,
    page_size: 100,
  });

  const chartData = useMemo(() => {
    const real = buildChartData(txData?.results ?? []);
    // اگر داده واقعی وجود داشت، نمایش بده؛ وگرنه mock
    return real.length > 0 ? real : portfolioChartData;
  }, [txData]);

  return (
    <Container>
      <DashboardCards />
      <PortfolioPerformanceChart data={chartData} />
      <InvestDashboardTable />
    </Container>
  );
}