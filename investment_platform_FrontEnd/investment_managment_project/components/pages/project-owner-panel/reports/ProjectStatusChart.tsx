"use client";

import { Pie, PieChart, Cell } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOwnerReports } from "@/lib/hooks/useOwnerReports";
import type { OwnerReportParams } from "@/lib/api/services/owner-dashboard.service";

// رنگ‌بندی بر اساس وضعیت
const STATUS_COLORS: Record<string, string> = {
  DRAFT: "#9ca3af",
  PENDING_REVIEW: "#f59e0b",
  APPROVED: "#3b82f6",
  FUNDING: "#8b5cf6",
  FUNDING_COMPLETED: "#10b981",
  ACTIVE: "#06b6d4",
  COMPLETED: "#22c55e",
  REJECTED: "#ef4444",
  CANCELED: "#6b7280",
  FUNDING_FAILED: "#f97316",
  default: "#e5e7eb",
};

function getColor(status: string): string {
  return STATUS_COLORS[status] ?? STATUS_COLORS.default;
}

interface Props {
  filters?: OwnerReportParams;
}

export default function ProjectStatusChart({ filters }: Props) {
  const { data, isLoading } = useOwnerReports(filters);

  const chartItems = (data?.status_chart ?? []).map((item) => ({
    id: item.status,
    title: item.status_display,
    value: item.count,
    color: getColor(item.status),
  }));

  const total = chartItems.reduce((s, i) => s + i.value, 0);

  // آیتم با بیشترین تعداد
  const dominant = chartItems.reduce(
    (max, item) => (item.value > max.value ? item : max),
    { id: "", title: "—", value: 0, color: "#e5e7eb" }
  );

  const chartConfig = Object.fromEntries(
    chartItems.map((item) => [
      item.id,
      { label: item.title, color: item.color },
    ])
  );

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-1/2 mb-4" />
        <div className="h-[260px] bg-gray-100 rounded-full mx-auto w-[260px]" />
      </div>
    );
  }

  if (chartItems.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex items-center justify-center min-h-[300px]">
        <p className="text-text-muted text-sm">داده‌ای برای نمایش وجود ندارد</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-text-main">وضعیت پروژه‌ها</h3>
        <p className="mt-1 text-sm text-text-muted">
          توزیع پروژه‌ها بر اساس وضعیت
        </p>
      </div>

      <div className="relative flex justify-center">
        <ChartContainer
          config={chartConfig}
          className="mx-auto h-[260px] w-[260px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Pie
              data={chartItems}
              dataKey="value"
              nameKey="title"
              innerRadius={75}
              outerRadius={100}
              paddingAngle={4}
              strokeWidth={0}
            >
              {chartItems.map((item) => (
                <Cell key={item.id} fill={item.color} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>

        {/* مرکز نمودار */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-text-main">
            {total}
          </span>
          <span className="text-sm text-text-muted">پروژه</span>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {chartItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm font-medium text-text-main">
                {item.title}
              </span>
            </div>
            <span className="text-sm font-bold text-text-main">
              {item.value} پروژه
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}