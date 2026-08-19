"use client";

import HeroSection from "@/components/pages/main/projects/HeroSection";
import ProjectsFilters from "@/components/pages/main/projects/ProjectsFilters";
import ProjectsGrid from "@/components/pages/main/projects/ProjectsGrid/ProjectsGrid";
import ProjectsPagination from "@/components/pages/main/projects/ProjectsGrid/ProjectsPagination";
import ProjectsToolbar from "@/components/pages/main/projects/ProjectsGrid/ProjectsToolbar";

import { useProjects } from "@/lib/hooks/useProjects";
import { useQueryParams } from "@/lib/hooks/useQueryParams";
import { ProjectFilters } from "@/lib/types/project-filters";
import { BackendProject } from "@/lib/api/services/projects.service";

// تبدیل داده بک‌اند به فرمت Project که کامپوننت‌های UI انتظار دارند
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
    documents: [],
  };
}

function mapStatus(s: string): "active" | "funded" | "closed" {
  const map: Record<string, "active" | "funded" | "closed"> = {
    APPROVED: "active", FUNDING: "active", ACTIVE: "active",
    FUNDING_COMPLETED: "funded", PROFIT_CALCULATION: "funded",
    PROFIT_DISTRIBUTED: "funded", COMPLETED: "funded",
  };
  return map[s] ?? "closed";
}

export default function ProjectsClient() {
  const { getAll, set } = useQueryParams<ProjectFilters>();
  const queryFilters = getAll();
  const currentPage = Number(queryFilters.page ?? 1);

  const { data, isLoading, isError } = useProjects({
    page: currentPage,
    page_size: 12,
    ...(queryFilters.search ? { q: queryFilters.search } : {}),
    ...(queryFilters.status ? { status: queryFilters.status as never } : {}),
    ...(queryFilters.industry ? { category: queryFilters.industry as never } : {}),
  });

  const projects = (data?.results ?? []).map(toUIProject);

  return (
    <>
      <HeroSection />
      <section className="mx-auto max-w-7xl px-4 py-8">
        <ProjectsFilters />
        <ProjectsToolbar count={isLoading ? 0 : (data?.count ?? 0)} />

        {isError && (
          <div className="text-center py-8 text-red-500 text-sm">
            خطا در بارگذاری پروژه‌ها. لطفاً دوباره تلاش کنید.
          </div>
        )}

        <ProjectsGrid projects={projects} />

        {(data?.total_pages ?? 1) > 1 && (
          <ProjectsPagination
            currentPage={currentPage}
            totalPages={data?.total_pages ?? 1}
            onPageChange={(page: number) => set("page", String(page))}
          />
        )}
      </section>
    </>
  );
}