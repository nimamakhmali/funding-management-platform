"use client";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {ChartConfig,ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import { PortfolioChartPoint } from "@/lib/types/investment-panel/invest-dashboard/investChart";

interface Props {
  data: PortfolioChartPoint[];
}
const chartConfig = {
  value: {
    label: "سرمایه",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function PortfolioPerformanceChart({
  data,
}: Props) {
  return (
    <section
      className="
      bg-white
      border
      border-gray-100
      rounded-2xl
      shadow-sm
      p-6
      "
    >
      <div
        className="
        flex
        justify-between
        items-center
        mb-8
        "
      >
        <div>
          <h3
            className="
            text-xl
            font-bold
            text-text-main
            "
          >
            عملکرد پورتفوی
          </h3>
          <p
            className="
            text-sm
            text-text-muted
            mt-1
            "
          >
            نمودار رشد سرمایه در ۶ ماه گذشته
          </p>
        </div>
      </div>
      <ChartContainer
        config={chartConfig}
        className="h-[300px] w-full"
      >
        <AreaChart
          data={data}
          margin={{
            left:12,
            right:12,
          }}
        >
          <CartesianGrid
            vertical={false}
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent />
            }
          />
          <Area
            dataKey="value"
            type="natural"
            fill="var(--color-value)"
            fillOpacity={0.25}
            stroke="var(--color-value)"
            strokeWidth={3}
          />
        </AreaChart>
      </ChartContainer>
    </section>
  );
}