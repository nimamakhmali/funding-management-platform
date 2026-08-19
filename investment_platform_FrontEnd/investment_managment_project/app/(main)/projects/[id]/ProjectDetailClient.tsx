"use client";

import { notFound } from "next/navigation";
import ProjectDetailsPage from "@/components/pages/main/project-details/ProjectDetailsPage";
import { useProjectDetail } from "@/lib/hooks/useProjects";
import { BackendProject } from "@/lib/api/services/projects.service";
import { ProjectDocument as BackendProjectDocument } from "@/lib/api/services/projects.service";
import { Project, ProjectDocument, ProjectStatus } from "@/lib/types/project";

interface Props {
  id: string;
}

function mapStatus(s: string): ProjectStatus {
  const map: Record<string, ProjectStatus> = {
    APPROVED: "active",
    FUNDING: "active",
    ACTIVE: "active",
    FUNDING_COMPLETED: "funded",
    PROFIT_CALCULATION: "funded",
    PROFIT_DISTRIBUTED: "funded",
    COMPLETED: "funded",
  };
  return map[s] ?? "closed";
}

function mapDocument(doc: BackendProjectDocument): ProjectDocument {
  const ext = doc.file_extension?.toLowerCase() ?? "";
  let type: ProjectDocument["type"] = "pdf";
  if (ext === "xlsx" || ext === "xls") type = "excel";
  else if (ext === "zip" || ext === "rar") type = "zip";

  return {
    id: doc.id,
    title: doc.title,
    size: doc.file_size_display,
    type,
    isLocked: true,
  };
}

function mapToProject(p: BackendProject): Project {
  return {
    id: p.id,
    title: p.title,
    symbol: p.owner?.username ?? "",
    description: p.description ?? "",
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
    chartData: [],
    projectCode: p.id.slice(0, 8).toUpperCase(),
    remainingDays: p.remaining_days,
    minInvestment: parseFloat(p.min_investment_amount) || 0,
    maxInvestment: parseFloat(p.max_investment_amount ?? p.required_budget) || 0,
    investmentPeriod: p.remaining_days,
    paymentPeriod: "ماهانه",
    guarantee: "ضمانت‌نامه بانکی",
    documents: (p.documents ?? []).map(mapDocument),
  };
}

function SkeletonDetail() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
}

export default function ProjectDetailClient({ id }: Props) {
  const { data: project, isLoading, isError } = useProjectDetail(id);

  if (isLoading) return <SkeletonDetail />;

  if (isError || !project) {
    notFound();
  }

  const adaptedProject = mapToProject(project);

  return <ProjectDetailsPage project={adaptedProject} />;
}
