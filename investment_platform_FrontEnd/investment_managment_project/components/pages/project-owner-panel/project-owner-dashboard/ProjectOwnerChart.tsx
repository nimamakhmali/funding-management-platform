"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useOwnerMonthlyStats } from "@/lib/hooks/useOwnerDashboard";

const chartConfig = {
  value: {
    label: "جذب سرمایه (تومان)",
    color: "var(--primary)",
  },
};

// skeleton داخلی
function ChartSkeleton() {
  return (
    <div className="h-72 w-full animate-pulse flex items-end gap-3 px-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex-1 bg-gray-100 rounded-t-lg"
          style={{ height: `${40 + Math.random() * 60}%` }}
        />
      ))}
    </div>
  );
}

export default function ProjectOwnerChart() {
  const { data, isLoading } = useOwnerMonthlyStats();

  if (isLoading) return <ChartSkeleton />;

  const chartData = data ?? [];

  if (chartData.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-text-muted text-sm">
        داده‌ای برای نمایش وجود ندارد
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="h-72 w-full">
      <BarChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={10}
        />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <Bar
          dataKey="value"
          radius={8}
          fill="var(--color-value)"
        />
      </BarChart>
    </ChartContainer>
  );
}