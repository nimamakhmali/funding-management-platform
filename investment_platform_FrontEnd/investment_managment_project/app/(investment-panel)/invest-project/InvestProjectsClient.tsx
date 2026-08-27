"use client";

import { useState } from "react";
import PanelContentHeader from "@/components/ui/PanelContentHeader";
import { useInvestableProjects, useWallet } from "@/lib/hooks/useInvestorDashboard";
import ProjectCard from "@/components/pages/main/projects/ProjectsGrid/ProjectCard";
import { TablePagination } from "@/components/ui/TablePagination";
import type { BackendProject } from "@/lib/api/services/projects.service";
import Card from "@/components/ui/Card";
import { resolveImageUrl } from "@/lib/utils/image.utils";
import { CircleDollarSign, TrendingUp, Wallet, BarChart3 } from "lucide-react";

const PAGE_SIZE = 6;

function resolveOwnerName(owner: BackendProject["owner"]): string {
  if (!owner) return "—";
  if ("full_name" in owner && owner.full_name) return owner.full_name as string;
  if (
    owner.username &&
    !owner.username.startsWith("09") &&
    owner.username !== owner.phone_number
  ) {
    return owner.username;
  }
  const phone = owner.phone_number ?? owner.username ?? "";
  if (phone.length === 11) {
    return `${phone.slice(0, 4)} *** ${phone.slice(7)}`;
  }
  return phone || "—";
}

function toUIProject(p: BackendProject) {
  return {
    id: p.id,
    title: p.title,
    symbol: resolveOwnerName(p.owner),
    description: p.description ?? "",
    shortDescription: (p.description ?? "").slice(0, 120),
    industry: p.category_display ?? "—",
    category: p.category_display ?? "—",
    image: resolveImageUrl(p.cover_image_url),  // ← اصلاح شد
    status: "active" as const,
    progress: parseFloat(p.funding_percentage) || 0,
    targetAmount: parseFloat(p.required_budget) || 0,
    fundedAmount: parseFloat(p.raised_amount) || 0,
    investors: p.investors_count ?? 0,
    profit: parseFloat(p.profit_rate_percentage ?? "0") || 0,
    chartData: [] as number[],
    projectCode: p.id.slice(0, 8).toUpperCase(),
    remainingDays: p.remaining_days ?? 0,
    minInvestment: parseFloat(p.min_investment_amount) || 0,
    maxInvestment: parseFloat(p.max_investment_amount ?? p.required_budget) || 0,
    investmentPeriod: p.remaining_days ?? 0,
    paymentPeriod: "ماهانه",
    guarantee: "ضمانت‌نامه بانکی",
    documents: [],
  };
}

export default function InvestProjectsPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: wallet } = useWallet();
  const { data, isLoading, isError } = useInvestableProjects({
    page: currentPage,
    page_size: PAGE_SIZE,
  });

  const projects = (data?.results ?? []).map(toUIProject);
  const totalPages = data?.total_pages ?? 1;

  const balance = parseFloat(wallet?.available_balance ?? "0");
  const blocked = parseFloat(wallet?.blocked_amount ?? "0");

  const statCards = [
    {
      id: 1,
      title: "موجودی قابل سرمایه‌گذاری",
      value: balance.toLocaleString("fa-IR"),
      unit: "تومان",
      icon: Wallet,
      color: "text-primary",
    },
    {
      id: 2,
      title: "در حال سرمایه‌گذاری",
      value: blocked.toLocaleString("fa-IR"),
      unit: "تومان",
      icon: CircleDollarSign,
      color: "text-yellow-500",
    },
    {
      id: 3,
      title: "پروژه‌های فعال",
      value: (data?.count ?? 0).toLocaleString("fa-IR"),
      unit: "پروژه",
      icon: BarChart3,
      color: "text-green-500",
    },
    {
      id: 4,
      title: "بازده میانگین",
      value:
        projects.length
          ? (
              projects.reduce((s, p) => s + p.profit, 0) / projects.length
            ).toFixed(1)
          : "۰",
      unit: "٪",
      icon: TrendingUp,
      color: "text-blue-500",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-8 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <PanelContentHeader
          title="پروژه‌های سرمایه‌گذاری"
          description="لیست پروژه‌های قابل سرمایه‌گذاری"
        />
      </div>

      {/* کارت‌های آماری */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => (
          <Card
            key={card.id}
            data={card}
            mapping={{
              title: "title",
              value: "value",
              unit: "unit",
              icon: "icon",
            }}
            iconPosition="header"
          />
        ))}
      </div>

      {/* لیست پروژه‌ها */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: PAGE_SIZE }).map((_, i) => (
            <div key={i} className="h-80 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-red-500 text-sm">
          خطا در بارگذاری پروژه‌ها. لطفاً دوباره تلاش کنید.
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          در حال حاضر پروژه‌ای برای سرمایه‌گذاری وجود ندارد
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              detailsHref={`/invest-project/${project.id}`}
            />
          ))}
        </div>
      )}

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