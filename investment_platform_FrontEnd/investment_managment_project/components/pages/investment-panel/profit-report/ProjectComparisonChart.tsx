"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOwnerReports } from "@/lib/hooks/useOwnerReports";
import type { OwnerReportParams } from "@/lib/api/services/owner-dashboard.service";

const chartConfig = {
  raised: {
    label: "جذب شده",
    color: "hsl(var(--primary))",
  },
  target: {
    label: "هدف",
    color: "#e5e7eb",
  },
};

interface Props {
  filters?: OwnerReportParams;
}

export default function ProjectComparisonChart({ filters }: Props) {
  const { data, isLoading } = useOwnerReports(filters);

  // تبدیل داده بک‌اند به فرمت نمودار
  const chartData = (data?.comparison_chart ?? []).map((item) => ({
    name: item.name,
    target: Math.round(item.target / 1_000_000),   // تبدیل به میلیون
    raised: Math.round(item.raised / 1_000_000),
  }));

  if (isLoading) {
    return (
      <section className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm animate-pulse">
        <div className="h-5 bg-gray-100 rounded w-1/3 mb-6" />
        <div className="h-[320px] bg-gray-100 rounded" />
      </section>
    );
  }

  return (
    <section className="col-span-1 lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-text-dark">
            مقایسه پروژه‌ها از نظر تأمین مالی
          </h3>
          <p className="text-xs text-text-muted mt-1">
            ارقام به میلیون تومان
          </p>
        </div>

        <div className="flex gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-text-muted">جذب شده</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-200" />
            <span className="text-text-muted">هدف</span>
          </div>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="flex items-center justify-center h-[320px] text-text-muted text-sm">
          داده‌ای برای نمایش وجود ندارد
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[320px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" />
            <XAxis dataKey="name" tickLine={false} axisLine={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent />}
            />
            <Bar dataKey="target" fill="#e5e7eb" radius={[8, 8, 0, 0]} />
            <Bar dataKey="raised" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      )}
    </section>
  );
}