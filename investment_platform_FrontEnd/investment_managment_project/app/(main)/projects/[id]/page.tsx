"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import ProjectDetailsPage from "@/components/pages/main/project-details/ProjectDetailsPage";
import { useProjectDetail } from "@/lib/hooks/useProjects";
import { BackendProject } from "@/lib/api/services/projects.service";

function mapStatus(s: string): "active" | "funded" | "closed" {
  const map: Record<string, "active" | "funded" | "closed"> = {
    APPROVED: "active", FUNDING: "active", ACTIVE: "active",
    FUNDING_COMPLETED: "funded", PROFIT_CALCULATION: "funded",
    PROFIT_DISTRIBUTED: "funded", COMPLETED: "funded",
  };
  return map[s] ?? "closed";
}

function toUIProject(p: BackendProject) {
  return {
    id: p.id,
    title: p.title,
    symbol: p.owner?.username ?? "",
    description: p.description,
    shortDescription: p.description?.slice(0, 120) ?? "",
    industry: p.category_display,
    category: p.category_display,
    image: p.cover_image_url ?? "/images/img-1.png",
    status: mapStatus(p.status),
    progress: parseFloat(p.funding_percentage) || 0,
    targetAmount: parseFloat(p.required_budget) || 0,
    fundedAmount: parseFloat(p.raised_amount) || 0,
    investors: p.investors_count,
    profit: parseFloat(p.profit_rate_percentage ?? "0") || 0,
    chartData: [] as number[],
    projectCode: p.id.slice(0, 8).toUpperCase(),
    remainingDays: p.remaining_days,
    minInvestment: parseFloat(p.min_investment_amount) || 0,
    maxInvestment: parseFloat(p.max_investment_amount ?? p.required_budget) || 0,
    investmentPeriod: p.remaining_days,
    paymentPeriod: "ماهانه",
    guarantee: "ضمانت‌نامه بانکی",
    // اسناد واقعی از بک‌اند
    documents: p.documents.map((d) => ({
      id: d.id,
      title: d.title,
      size: d.file_size_display,
      type: (d.file_extension || "pdf") as "pdf" | "excel" | "zip",
      isLocked: false,
      url: d.file_url,
    })),
  };
}

function ProjectDetailContent({ id }: { id: string }) {
  const { data: project, isLoading, isError } = useProjectDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError || !project) {
    notFound();
  }

  return <ProjectDetailsPage project={toUIProject(project)} />;
}

type Props = { params: Promise<{ id: string }> };

export default function Page({ params }: Props) {
  const { id } = use(params);
  return <ProjectDetailContent id={id} />;
}