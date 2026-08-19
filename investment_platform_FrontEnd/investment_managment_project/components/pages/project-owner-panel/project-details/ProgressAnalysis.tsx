"use client";
import {Area, AreaChart, CartesianGrid, XAxis} from "recharts";
import {ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { chartConfig, periodOptions } from "@/lib/constants/project-owner-panel/project-details/progress-analysis";
import { ProjectProgressCardProps } from "@/lib/types/project-owner-panel/project-details/Progress-analysis-types";

export function ProjectProgressChart({
  title,
  description,
  data,
  className,
}: ProjectProgressCardProps) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",
        className
      )}
    >
      <div className="border-b border-slate-100 px-4 py-5 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 md:text-xl">
              {title}
            </h2>

            {description && (
              <p className="mt-1 text-sm text-slate-500">
                {description}
              </p>
            )}
          </div>

          <select className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none transition-colors focus:border-primary">
            {periodOptions.map((period) => (
              <option key={period}>
                {period}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <ChartContainer
          config={chartConfig}
          className="min-h-[320px] w-full"
        >
          <AreaChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 12,
              left: 12,
            }}
          >
            <defs>
              <linearGradient
                id="fillProgress"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="var(--color-progress)"
                  stopOpacity={0.35}
                />

                <stop
                  offset="95%"
                  stopColor="var(--color-progress)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              strokeDasharray="4 4"
              strokeOpacity={0.2}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tickMargin={12}
              tick={{ fontSize: 12 }}
            />

            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                />
              }
            />

            <Area
              type="monotone"
              dataKey="progress"
              stroke="var(--color-progress)"
              strokeWidth={3}
              fill="url(#fillProgress)"
              dot={false}
              activeDot={{ r: 5 }}
              animationDuration={900}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </section>
  );
}