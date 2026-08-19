"use client";

import {
  TrendingUp, CircleDollarSign, WalletMinimal, Percent,
} from "lucide-react";

import ProjectOwnerDashboardCard from "./ProjectOwnerDashboardCard";
import { useOwnerDashboard } from "@/lib/hooks/useOwnerDashboard";
import type { ProjectOwnerDashboardCards } from
  "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerDashboardCards";

// تبدیل عدد به فرمت فارسی خوانا
function formatAmount(value: string | number): string {
  const num = typeof value === "string" ? parseFloat(value) : value;
  if (isNaN(num)) return "۰";
  return num.toLocaleString("fa-IR");
}

export default function ProjectOwnerDashboardCards() {
  const { data, isLoading } = useOwnerDashboard();
  const stats = data?.stats;

  // کارت‌ها با داده واقعی
  const cards: ProjectOwnerDashboardCards[] = [
    {
      title: "کل سرمایه جذب‌شده",
      value: isLoading ? "..." : formatAmount(stats?.total_raised ?? 0),
      unit: "تومان",
      description: `از ${stats?.total_projects ?? 0} طرح`,
      icon: <CircleDollarSign />,
      iconClassName: "bg-primary/5 text-primary",
    },
    {
      title: "سود پیش‌بینی‌شده",
      value: isLoading ? "..." : formatAmount(stats?.expected_profit ?? 0),
      unit: "تومان",
      description: `بر اساس ${stats?.active_projects ?? 0} طرح فعال`,
      icon: <TrendingUp />,
      iconClassName: "bg-primary/5 text-primary",
    },
    {
      title: "سود تحقق‌یافته",
      value: isLoading ? "..." : formatAmount(stats?.realized_profit ?? 0),
      unit: "تومان",
      description: "واریز شده به حساب",
      icon: <WalletMinimal />,
      iconClassName: "bg-primary/5 text-primary",
    },
    {
      title: "بازده کل (ROI)",
      value: isLoading ? "..." : `${(stats?.roi_percentage ?? 0).toFixed(1)}٪`,
      description: "میانگین تمام طرح‌ها",
      icon: <Percent />,
      iconClassName: "bg-primary/5 text-primary",
      badge:
        (stats?.roi_percentage ?? 0) > 0
          ? {
              text: `+${(stats?.roi_percentage ?? 0).toFixed(1)}٪`,
              className: "bg-primary/10 text-primary",
            }
          : undefined,
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <ProjectOwnerDashboardCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}