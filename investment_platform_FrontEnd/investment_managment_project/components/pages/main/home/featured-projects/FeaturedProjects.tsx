"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";
import { BackendProject } from "@/lib/api/services/projects.service";
import { Project } from "@/lib/types/project";
import ProjectCard from "@/components/pages/main/projects/ProjectsGrid/ProjectCard";

// تبدیل BackendProject به Project (نوع مورد انتظار ProjectCard)
function mapToProjectCard(p: BackendProject): Project {
  const fundedAmount = parseFloat(p.raised_amount) / 1_000_000;
  const targetAmount = parseFloat(p.required_budget) / 1_000_000;

  const statusMap: Record<string, "active" | "funded" | "closed"> = {
    FUNDING: "active",
    APPROVED: "active",
    FUNDING_COMPLETED: "funded",
    ACTIVE: "active",
    COMPLETED: "closed",
    ARCHIVED: "closed",
    CANCELED: "closed",
    FUNDING_FAILED: "closed",
    DRAFT: "closed",
    PENDING_REVIEW: "closed",
    NEEDS_REVISION: "closed",
    REJECTED: "closed",
    PROFIT_CALCULATION: "active",
    PROFIT_DISTRIBUTED: "active",
  };

  return {
    id: p.id,
    title: p.title,
    symbol: `IP-${p.id.slice(-4).toUpperCase()}`,
    description: p.description,
    shortDescription: p.description.slice(0, 80),
    industry: p.category_display,
    category: p.category_display,
    image: p.cover_image_url ?? "/images/img-1.png",
    status: statusMap[p.status] ?? "closed",
    progress: parseFloat(p.funding_percentage),
    targetAmount,
    fundedAmount,
    investors: p.investors_count,
    profit: parseFloat(p.profit_rate_percentage ?? "0"),
    chartData: [],
    projectCode: p.id,
    remainingDays: p.remaining_days,
    minInvestment: parseFloat(p.min_investment_amount),
    maxInvestment: p.max_investment_amount
      ? parseFloat(p.max_investment_amount)
      : 0,
    investmentPeriod: 0,
    paymentPeriod: "",
    guarantee: "",
    documents: [],
  };
}

// Skeleton برای حالت loading
function ProjectCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-surface animate-pulse">
      <div className="h-48 bg-gray-200 rounded-t-2xl" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-10 bg-gray-200 rounded-xl mt-6" />
      </div>
    </div>
  );
}

export default function FeaturedProjects() {
  const { data, isLoading } = useProjects({
    status: "FUNDING",
    page_size: 3,
  });

  const projects = data?.results ?? [];

  return (
    <section id="featured-projects" className="py-20">
      <div className="mx-auto max-w-[1280px] px-6">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-black text-text-main">
              طرح‌های سرمایه‌گذاری منتخب
            </h2>
            <p className="mt-4 text-text-muted">
              بهترین فرصت‌های سرمایه‌گذاری در دسترس شما
            </p>
          </div>

          <Link
            href="/projects"
            className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3 text-sm transition-all hover:gap-3"
          >
            مشاهده تمام فرصت‌ها
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <ProjectCardSkeleton key={i} />
              ))
            : projects.length > 0
            ? projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={mapToProjectCard(project)}
                />
              ))
            : // Fallback: اگر پروژه‌ای با وضعیت FUNDING نبود
              ["APPROVED", "ACTIVE", "FUNDING_COMPLETED"].map((status, i) => null)
          }
        </div>

        {/* اگر پروژه‌ای وجود نداشت */}
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12 text-text-muted">
            در حال حاضر طرحی برای نمایش وجود ندارد
          </div>
        )}
      </div>
    </section>
  );
}