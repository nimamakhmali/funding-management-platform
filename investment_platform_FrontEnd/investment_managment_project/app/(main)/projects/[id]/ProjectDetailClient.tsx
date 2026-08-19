"use client";

import { notFound } from "next/navigation";
import ProjectDetailsPage from "@/components/pages/main/project-details/ProjectDetailsPage";
import { useProjectDetail } from "@/lib/hooks/useProjects";

interface Props {
  id: string;
}

export default function ProjectDetailClient({ id }: Props) {
  const { data: project, isLoading, isError } = useProjectDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isError || !project) {
    notFound();
  }

  // تبدیل Project بک‌اند به فرمت مورد انتظار ProjectDetailsPage
  const adaptedProject = {
    id: project.id,
    title: project.title,
    symbol: project.owner?.username ?? "",
    industry: project.category ?? "",
    status: project.status,
    statusDisplay: project.status_display,
    targetAmount: parseFloat(project.required_budget) || 0,
    raisedAmount: parseFloat(project.raised_amount) || 0,
    profit: parseFloat(project.profit_rate_percentage ?? "0") || 0,
    fundingPercentage: parseFloat(project.funding_percentage) || 0,
    isFundingComplete: project.is_funding_complete,
    startDate: project.start_date,
    endDate: project.end_date,
    description: project.description,
    minInvestment: parseFloat(project.min_investment_amount) || 0,
    owner: project.owner,
  };

  return <ProjectDetailsPage project={adaptedProject} />;
}