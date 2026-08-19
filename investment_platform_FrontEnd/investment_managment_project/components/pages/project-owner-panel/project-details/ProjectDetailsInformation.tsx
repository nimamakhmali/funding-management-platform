"use client";

import { useSearchParams } from "next/navigation";
import { TrendingUp, Target, Wallet, Building } from "lucide-react";

import { ProjectDetailsCard } from "./ProjectDetailsCard";
import { ProjectFinancialCard } from "./ProjectDetailsAmount";
import { useProjectDetail } from "@/lib/hooks/useOwnerDashboard";

// ── helper: تبدیل عدد به فرمت فارسی ─────────────────────────────────────────
function fmt(value: string | number): number {
  return typeof value === "string" ? parseFloat(value) : value;
}

// ── skeleton ──────────────────────────────────────────────────────────────────
function InfoSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
      <div className="h-40 rounded-2xl bg-gray-100" />
      <div className="md:col-span-2 h-40 rounded-2xl bg-gray-100" />
    </div>
  );
}

export default function ProjectDetailsInformation() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get("id");

  const { data: project, isLoading, isError } = useProjectDetail(projectId);

  if (isLoading) return <InfoSkeleton />;

  if (isError || !project) {
    return (
      <div className="py-8 text-center text-sm text-red-500">
        خطا در بارگذاری اطلاعات پروژه.
      </div>
    );
  }

  const targetAmount = fmt(project.required_budget);
  const raisedAmount = fmt(project.raised_amount);
  const fundingPct = parseFloat(project.funding_percentage) || 0;

  // تاریخ فارسی
  const createdDate = new Date(project.created_at).toLocaleDateString("fa-IR");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* کارت نام پروژه */}
      <ProjectDetailsCard
        title="نام پروژه"
        description={project.title}
        date={createdDate}
        icon={<Building />}
        iconClassName="p-3 rounded-xl bg-primary/10 text-primary"
        badge={
          project.profit_rate_percentage
            ? {
                text: `+${project.profit_rate_percentage}٪`,
                icon: <TrendingUp />,
                className:
                  "flex items-center text-primary text-xs font-black bg-primary/10 px-3 py-1.5 rounded-full tabular-nums",
              }
            : undefined
        }
      />

      {/* کارت مالی */}
      <ProjectFinancialCard
        className="md:col-span-2"
        targetAmount={{
          icon: <Target className="text-sm" />,
          iconClassName: "p-1.5 bg-purple-50 text-primary rounded-md",
          label: "مبلغ هدف",
          amount: targetAmount,
          currency: "تومان",
        }}
        raisedAmount={{
          icon: <Wallet className="text-sm" />,
          iconClassName: "p-1.5 bg-indigo-50 text-indigo-600 rounded-md",
          label: "مبلغ جذب‌شده",
          amount: raisedAmount,
          currency: "تومان",
        }}
        progress={{
          percentage: fundingPct,
          label: `${fundingPct.toFixed(0)}٪ تأمین شده`,
          remainingTime: `زمان باقی‌مانده: ${project.remaining_days} روز`,
        }}
      />
    </div>
  );
}