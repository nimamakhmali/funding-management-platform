// app/(admin)/admin-dashboard/page.tsx
"use client";

import AdminDashboardChart from "@/components/pages/admin/admin-dashboard/AdminDashboardChart";
import DashboardCard from "@/components/pages/admin/admin-dashboard/DashboardCard";
import Container from "@/components/ui/Container";
import AdminDashboardAlerts from "@/components/pages/admin/admin-dashboard/AdminDashboardAlerts";
import AdminDashboardTransactionTable from "@/components/pages/admin/admin-dashboard/AdminRecentTransactionTable";
import AdminDashboardHeader from "@/components/pages/admin/admin-dashboard/AdminDashboardHeader";
import { useAdminDashboardStats } from "@/lib/hooks/useAdmin";
import {
  Wallet,
  Rocket,
  Users,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { AdminDashboardCardProps } from "@/lib/types/admin/admin-dashboard/AdminDashboardCard";

export default function Page() {
  const { data: stats, isLoading } = useAdminDashboardStats();

  const dashboardCards: AdminDashboardCardProps[] = stats
    ? [
        {
          title: "مجموع سرمایه‌گذاری‌ها",
          value: Number(stats.total_invested).toLocaleString("fa-IR"),
          unit: "تومان",
          icon: <Wallet />,
          iconClassName: "bg-primary/10 text-primary",
          badge: {
            value: "",
            icon: <TrendingUp />,
            className: "text-blue-600",
          },
        },
        {
          title: "پروژه‌های فعال",
          value: stats.active_projects,
          unit: "پروژه",
          icon: <Rocket />,
          iconClassName: "bg-primary/10 text-primary",
          badge: {
            value: `${stats.pending_projects} در انتظار`,
            icon: <TrendingUp />,
            className: "text-yellow-600",
          },
        },
        {
          title: "کل کاربران فعال",
          value: stats.total_users.toLocaleString("fa-IR"),
          unit: "نفر",
          icon: <Users />,
          iconClassName: "bg-primary/10 text-primary",
          badge: {
            value: "",
            icon: <TrendingUp />,
            className: "text-blue-600",
          },
        },
        {
          title: "تراکنش‌های امروز",
          value: stats.today_transactions.toLocaleString("fa-IR"),
          unit: "تراکنش",
          icon: <CreditCard />,
          iconClassName: "bg-primary/10 text-primary",
          badge: {
            value: Number(stats.today_volume).toLocaleString("fa-IR"),
            icon: <TrendingUp />,
            className: "text-blue-600",
          },
        },
      ]
    : [];

  return (
    <Container>
      <AdminDashboardHeader />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-32 animate-pulse rounded-xl bg-gray-100"
              />
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