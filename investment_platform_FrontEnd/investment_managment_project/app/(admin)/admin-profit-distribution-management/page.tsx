"use client";
import AdminProfitTable from "@/components/pages/admin/admin-profit-management/AdminProfitTable";
import AdminProfitSummaryCards from "@/components/pages/admin/admin-profit-management/ProfitSummaryCard";
import Container from "@/components/ui/Container";
import ProfitHistoryTimeline from "@/components/pages/admin/admin-profit-management/ProfitHistoryTimeline";
import ProfitSecurityCard from "@/components/pages/admin/admin-profit-management/ProfitSecurityCard";
import AdminProfitManagementHeader from "@/components/pages/admin/admin-profit-management/AdminProfitManagementHeader";
import { useAdminProfitPeriods, useAdminDashboardStats } from "@/lib/hooks/useAdmin";
import { profitSupervisors } from "@/lib/constants/admin/admin-profit-management/ProfitHistory";
import { CircleDollarSign, Clock, TrendingUp } from "lucide-react";

export default function Page() {
  const { data: periodsData, isLoading } = useAdminProfitPeriods();
  const { data: stats } = useAdminDashboardStats();

  const summaryCards = [
    {
      title: "کل سود توزیع‌شده",
      value: stats ? Number(stats.total_invested) : 0,
      unit: "تومان",
      description: "مجموع سودهای پرداخت‌شده",
      icon: <CircleDollarSign size={20} />,
    },
    {
      title: "دوره‌های فعال",
      value: periodsData?.count ?? 0,
      unit: "دوره",
      description: "تعداد دوره‌های سود",
      icon: <TrendingUp size={20} />,
    },
    {
      title: "در انتظار تأیید",
      value:
        periodsData?.results?.filter((p) => p.status === "APPROVED").length ?? 0,
      unit: "دوره",
      description: "دوره‌های آماده توزیع",
      icon: <Clock size={20} />,
    },
  ];

  const historyItems =
    periodsData?.results?.map((p, index) => ({
      id: index + 1,
      title: p.title,
      description: `پروژه: ${p.project?.title ?? "نامشخص"} | مبلغ: ${Number(p.total_profit_amount).toLocaleString("fa-IR")} تومان`,
      active: p.status === "APPROVED",
    })) ?? [];

  return (
    <Container>
      <AdminProfitManagementHeader />
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
        {summaryCards.map((card) => (
          <AdminProfitSummaryCards key={card.title} card={card} />
        ))}
      </div>
      <AdminProfitTable data={periodsData?.results ?? []} isLoading={isLoading} />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProfitHistoryTimeline items={historyItems} />
        <ProfitSecurityCard supervisors={profitSupervisors} />
      </div>
    </Container>
  );
}