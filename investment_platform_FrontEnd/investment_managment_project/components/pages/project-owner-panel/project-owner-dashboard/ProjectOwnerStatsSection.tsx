"use client";

import { Package, Bolt } from "lucide-react";
import ProjectOwnerStatsCard from "./ProjectOwnerStatsCard";
import { useOwnerDashboard } from "@/lib/hooks/useOwnerDashboard";
import { ProjectOwnerStatsCard as StatsCardType } from
  "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerStatsCard";

export default function ProjectOwnerStatsSection() {
  const { data, isLoading } = useOwnerDashboard();
  const stats = data?.stats;

  const cards: StatsCardType[] = [
    {
      title: "کل طرح‌های ثبت شده",
      value: isLoading
        ? "..."
        : `${(stats?.total_projects ?? 0).toLocaleString("fa-IR")} طرح`,
      icon: <Package />,
      iconClassName: "bg-slate-50 text-slate-400",
      titleClassName: "text-text-secondary",
      cardClassName: "",
    },
    {
      title: "طرح‌های فعال و جاری",
      value: isLoading
        ? "..."
        : `${(stats?.active_projects ?? 0).toLocaleString("fa-IR")} طرح`,
      icon: <Bolt />,
      iconClassName: "bg-primary/5 text-primary",
      titleClassName: "text-primary",
      cardClassName: "border-r-4 border-r-primary",
    },
  ];

  return (
    <section>
      <div className="grid grid-cols-1 gap-4">
        {cards.map((card) => (
          <ProjectOwnerStatsCard key={card.title} card={card} />
        ))}
      </div>
    </section>
  );
}