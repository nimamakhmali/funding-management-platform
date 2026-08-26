"use client";
import AdminDashboardChart from "@/components/pages/admin/admin-dashboard/AdminDashboardChart";
import DashboardCard from "@/components/pages/admin/admin-dashboard/DashboardCard";
import Container from "@/components/ui/Container";
import AdminDashboardAlerts from "@/components/pages/admin/admin-dashboard/AdminDashboardAlerts";
import AdminDashboardTransactionTable from "@/components/pages/admin/admin-dashboard/AdminRecentTransactionTable";
import AdminDashboardHeader from "@/components/pages/admin/admin-dashboard/AdminDashboardHeader";
import { useAdminDashboardStats } from "@/lib/hooks/useAdmin";
import { TrendingUp, Users, FolderOpen, ArrowDownUp } from "lucide-react";

export default function Page() {
  const { data: stats, isLoading } = useAdminDashboardStats();

  const dashboardCards = stats
    ? [
        {
          title: "کل سرمایه‌گذاری",
          value: `${Number(stats.total_invested).toLocaleString("fa-IR")} ت`,
          icon: <TrendingUp size={24} />,
          iconClassName: "bg-primary/10 text-primary",
        },
        {
          title: "کاربران فعال",
          value: stats.total_users.toLocaleString("fa-IR"),
          icon: <Users size={24} />,
          iconClassName: "bg-blue-50 text-blue-600",
        },
        {
          title: "پروژه‌های فعال",
          value: stats.active_projects.toLocaleString("fa-IR"),
          icon: <FolderOpen size={24} />,
          iconClassName: "bg-amber-50 text-amber-600",
        },
        {
          title: "تراکنش‌های امروز",
          value: stats.today_transactions.toLocaleString("fa-IR"),
          icon: <ArrowDownUp size={24} />,
          iconClassName: "bg-green-50 text-green-600",
        },
      ]
    : [];

  return (
    <Container>
      <AdminDashboardHeader />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100" />
            ))
          : dashboardCards.map((card) => (
              <DashboardCard key={card.title} {...card} />
            ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AdminDashboardChart />
        </div>
        <div className="lg:col-span-1">
          <AdminDashboardAlerts />
        </div>
      </div>
      <AdminDashboardTransactionTable />
    </Container>
  );
}