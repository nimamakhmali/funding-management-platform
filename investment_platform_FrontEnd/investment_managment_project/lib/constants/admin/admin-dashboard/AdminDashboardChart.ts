import type { ChartConfig } from "@/components/ui/chart";

export const adminChartData = [
  { month: "فروردین", investment: 180 },
  { month: "اردیبهشت", investment: 240 },
  { month: "خرداد", investment: 310 },
  { month: "تیر", investment: 450 },
  { month: "مرداد", investment: 520 },
  { month: "شهریور", investment: 680 },
] as const;

export const adminchartConfig = {
  investment: {
    label: "سرمایه",
    color: "primary",
  },
} satisfies ChartConfig;