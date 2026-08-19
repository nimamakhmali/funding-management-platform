import { ChartConfig } from "@/components/ui/chart";

export const projectStatusChartConfig = {
  completed: {
    label: "تکمیل شده",
    color: "var(--primary)",
  },

  running: {
    label: "در حال اجرا",
    color: "var(--primary-500)",
  },

  waiting: {
    label: "در انتظار",
    color: "var(--primary-300)",
  },
} satisfies ChartConfig;