"use client"
import AdminDashboardChartHeader from "./AdminDashboardChartHeader";
import {
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  ChartContainer,
} from "@/components/ui/chart";

import { adminChartData, adminchartConfig } from "@/lib/constants/admin/admin-dashboard/AdminDashboardChart";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
} from "recharts";
export default function AdminDashboardChart() {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <AdminDashboardChartHeader />

    <ChartContainer
  config={ adminchartConfig}
  className="h-[320px] w-full"
>
<AreaChart data={adminChartData}>
  <CartesianGrid
    vertical={false}
    strokeDasharray="3 3"
  />

  <XAxis
    dataKey="month"
    tickLine={false}
    axisLine={false}
    tickMargin={12}
  />

  <Tooltip
    cursor={false}
    content={<ChartTooltipContent />}
  />

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