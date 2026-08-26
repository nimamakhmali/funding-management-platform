// app/(admin)/admin-profit-distribution-management/page.tsx
"use client";

import AdminProfitTable from "@/components/pages/admin/admin-profit-management/AdminProfitTable";
import AdminProfitSummaryCards from "@/components/pages/admin/admin-profit-management/ProfitSummaryCard";
import Container from "@/components/ui/Container";
import ProfitHistoryTimeline from "@/components/pages/admin/admin-profit-management/ProfitHistoryTimeline";
import ProfitSecurityCard from "@/components/pages/admin/admin-profit-management/ProfitSecurityCard";
import AdminProfitManagementHeader from "@/components/pages/admin/admin-profit-management/AdminProfitManagementHeader";
import { useAdminProfitPeriods } from "@/lib/hooks/useAdmin";
import { profitSupervisors } from "@/lib/constants/admin/admin-profit-management/ProfitHistory";
import { ProfitSummaryCard } from "@/lib/types/admin/admin-profit-management/ProfitSummaryCard-types";
import { AdminProfitHistoryItem } from "@/lib/types/admin/admin-profit-management/AdminProfitHistory";
import { Clock, Calendar, CreditCard } from "lucide-react";

export default function Page() {
  const { data: periodsData, isLoading } = useAdminProfitPeriods();

  const periods = periodsData?.results ?? [];

  const totalPendingAmount = periods
    .filter((p) => p.status === "APPROVED")
    .reduce((sum, p) => sum + Number(p.total_profit_amount), 0);

  const totalDistributedAmount = periods
    .filter((p) => p.status === "DISTRIBUTED")
    .reduce((sum, p) => sum + Number(p.total_profit_amount), 0);

  const summaryCards: ProfitSummaryCard[] = [
    {
      title: "مجموع سود در انتظار تایید",
      value: totalPendingAmount,
      unit: "تومان",
      description: `${periods.filter((p) => p.status === "APPROVED").length} دوره در انتظار`,
      icon: <Clock className="size-5" />,
      highlighted: true,
    },
    {
      title: "تعداد دوره‌های فعال",
      value: periods.length,
      unit: "دوره مالی",
      description: "در حال پردازش سیستمی",
      icon: <Calendar className="size-5" />,
    },
    {
      title: "سود توزیع شده",
      value: totalDistributedAmount,
      unit: "تومان",
      description: "تمامی پرداخت‌های موفق",
      icon: <CreditCard className="size-5" />,
      highlighted: totalDistributedAmount > 0,
    },
  ];

  // mapping بک‌اند → AdminProfitHistoryItem
  const historyItems: AdminProfitHistoryItem[] = periods
    .slice(0, 5)
    .map((p, index) => ({
      id: index + 1,
      title: p.title,
      description: `پروژه: ${p.project?.title ?? "—"} • ${p.calculation_date}`,
      active: p.status === "APPROVED" || p.status === "DISTRIBUTED",
    }));

  return (
    <Container>
      <AdminProfitManagementHeader />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <AdminProfitSummaryCards key={card.title} card={card} />
        ))}
      </div>

      <AdminProfitTable data={periods} isLoading={isLoading} />

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProfitHistoryTimeline items={historyItems} />
        <ProfitSecurityCard supervisors={profitSupervisors} />
      </div>
    </Container>
  );
}