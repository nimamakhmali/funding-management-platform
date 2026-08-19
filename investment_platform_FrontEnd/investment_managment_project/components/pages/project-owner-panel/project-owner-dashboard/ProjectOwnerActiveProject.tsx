"use client";

import { Building } from "lucide-react";
import ProjectOwnerActiveProjectHeader from "./ProjectOwnerActiveProjectHeader";
import ProjectOwnerActiveProjectInfo from "./ProjectOwnerActiveProjectInfo";
import ProjectOwnerProgress from "./ProjectOwnerProgress";
import { useOwnerDashboard } from "@/lib/hooks/useOwnerDashboard";

function formatAmount(value: string): string {
  const num = parseFloat(value);
  if (isNaN(num)) return "۰";
  return num.toLocaleString("fa-IR");
}

export default function ProjectOwnerActiveProject() {
  const { data, isLoading } = useOwnerDashboard();
  const project = data?.most_active_project;

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-8 bg-gray-200 rounded" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card p-8 text-center text-gray-400 text-sm">
        هیچ پروژه فعالی وجود ندارد
      </div>
    );
  }

  // تبدیل داده بک‌اند به فرمت مورد انتظار کامپوننت
  const activeProjectData = {
    title: project.title,
    code: project.id.slice(0, 8).toUpperCase(),
    progress: project.progress,
    targetPercent: project.progress,
    status: project.status_display,
    icon: <Building size={36} />,
    stats: [
      {
        label: "مبلغ هدف",
        value: formatAmount(project.required_budget),
        unit: "تومان",
      },
      {
        label: "جذب شده",
        value: formatAmount(project.raised_amount),
        unit: "تومان",
        valueClassName: "text-primary",
      },
      {
        label: "سرمایه‌گذاران",
        value: `${project.investors_count.toLocaleString("fa-IR")} نفر`,
      },
      {
        label: "باقیمانده",
        value: `${project.remaining_days.toLocaleString("fa-IR")} روز`,
      },
    ],
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <ProjectOwnerActiveProjectHeader
        title="وضعیت فعال‌ترین طرح"
        status={activeProjectData.status}
      />
      <div className="p-8">
        <ProjectOwnerActiveProjectInfo project={activeProjectData} />
        <ProjectOwnerProgress progress={activeProjectData.progress} />
      </div>
    </div>
  );
}