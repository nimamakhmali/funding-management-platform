import { ChartConfig } from "@/components/ui/chart";
import { ProgressChartItem } from "@/lib/types/project-owner-panel/project-details/Progress-analysis-types";

export const chartConfig = {
  progress: {
    label: "پیشرفت پروژه",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export const periodOptions = [
  "۳۰ روز گذشته",
  "۶ ماه گذشته",
  "۱ سال گذشته",
];

export const mockProjectProgress: ProgressChartItem[] = [
  { month: "فروردین", progress: 15 },
  { month: "اردیبهشت", progress: 22 },
  { month: "خرداد", progress: 35 },
  { month: "تیر", progress: 48 },
  { month: "مرداد", progress: 62 },
  { month: "شهریور", progress: 71 },
  { month: "مهر", progress: 83 },
  { month: "آبان", progress: 92 },
];