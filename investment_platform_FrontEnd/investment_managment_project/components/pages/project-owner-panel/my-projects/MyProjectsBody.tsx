"use client";

import { useState } from "react";
import { useMyProjects } from "@/lib/hooks/useOwnerDashboard";
import { TablePagination } from "@/components/ui/TablePagination";
import ProjectCard from "../../main/projects/ProjectsGrid/ProjectCard";
import { BackendProject } from "@/lib/api/services/projects.service";
import { resolveImageUrl } from "@/lib/utils/image.utils"; // ← اضافه شد

function toUIProject(p: BackendProject) {
  return {
    id: p.id,
    title: p.title,
    symbol: p.owner?.username ?? "",
    description: p.description,
    shortDescription: p.description?.slice(0, 120) ?? "",
    industry: p.category_display,
    category: p.category_display,
    image: resolveImageUrl(p.cover_image_url), // ← تغییر کرد
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
    documents: [],
  };
}

function mapStatus(s: string): "active" | "funded" | "closed" {
  const m: Record<string, "active" | "funded" | "closed"> = {
    APPROVED: "active", FUNDING: "active", ACTIVE: "active",
    FUNDING_COMPLETED: "funded", COMPLETED: "funded",
    PROFIT_DISTRIBUTED: "funded", PROFIT_CALCULATION: "funded",
  };
  return m[s] ?? "closed";
}

export default function MyProjectsBody() {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 6;

  const { data, isLoading, isError } = useMyProjects({
    page: currentPage,
    page_size: PAGE_SIZE,
  });

  const projects = (data?.results ?? []).map(toUIProject);
  const totalPages = data?.total_pages ?? 1;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mt-10">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <div key={i} className="rounded-2xl border border-border bg-white h-80 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-12 text-red-500 text-sm">
        خطا در بارگذاری پروژه‌ها. لطفاً دوباره تلاش کنید.
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="text-center py-12 text-gray-400 text-sm mt-10">
        هیچ پروژه‌ای ثبت نشده است.
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mt-10">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            detailsHref="/project-details"
          />
        ))}
      </div>

      {totalPages > 1 && (
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}