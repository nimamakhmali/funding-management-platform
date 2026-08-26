// components/pages/admin/admin-dashboard/AdminDashboardChart.tsx
"use client";

import AdminDashboardChartHeader from "./AdminDashboardChartHeader";
import { ChartTooltip, ChartTooltipContent, ChartContainer } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useAdminMonthlyChart } from "@/lib/hooks/useAdmin";

const chartConfig = {
  investment: {
    label: "سرمایه‌گذاری",
    color: "hsl(var(--primary))",
  },
};

export default function AdminDashboardChart() {
  const { data: chartData, isLoading } = useAdminMonthlyChart();

  const formattedData = (chartData ?? []).map((item) => ({
    month: item.month,
    investment: item.value,
  }));

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <AdminDashboardChartHeader />
        <div className="h-[320px] w-full animate-pulse rounded-lg bg-gray-100" />
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <AdminDashboardChartHeader />
      <ChartContainer config={chartConfig} className="h-[320px] w-full">
        <AreaChart data={formattedData}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={12}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Area
            dataKey="investment"
            type="monotone"
            fill="var(--color-investment)"
            fillOpacity={0.2}
            stroke="var(--color-investment)"
            strokeWidth={3}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}