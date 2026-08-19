"use client";

import { useMemo } from "react";
import StatisticCard from "./StatisticCard";
import { useOwnerReports } from "@/lib/hooks/useOwnerReports";
import {
  TrendingUp,
  FolderOpen,
  CircleDollarSign,
  BarChart3,
} from "lucide-react";
import { toPersianNumber } from "@/lib/utils/Numberformat";
import type { OwnerReportParams } from "@/lib/api/services/owner-dashboard.service";

interface Props {
  filters?: OwnerReportParams;
}

export default function StatisticsCards({ filters }: Props) {
  const { data, isLoading } = useOwnerReports(filters);

  const statistics = useMemo(() => {
    const stats = data?.stats;

    const fmt = (val: string | number) => {
      const n = typeof val === "string" ? parseFloat(val) : val;
      if (isNaN(n)) return "۰";
      return toPersianNumber(Math.round(n));
    };

    return [
      {
        id: 1,
        title: "کل سرمایه جذب‌شده",
        value: isLoading ? "..." : fmt(stats?.total_raised ?? 0),
        unit: "تومان",
        icon: <CircleDollarSign className="h-5 w-5" />,
        iconClass: "bg-primary/10 text-primary",
        footer: (
          <p className="text-xs text-text-muted">
            از مجموع{" "}
            <span className="font-bold text-text-main">
              {fmt(stats?.total_required ?? 0)}
            </span>{" "}
            تومان هدف
          </p>
        ),
      },
      {
        id: 2,
        title: "تعداد پروژه‌ها",
        value: isLoading ? "..." : toPersianNumber(stats?.total_projects ?? 0),
        unit: "پروژه",
        icon: <FolderOpen className="h-5 w-5" />,
        iconClass: "bg-blue-50 text-blue-600",
        footer: (
          <p className="text-xs text-text-muted">
            <span className="font-bold text-blue-600">
              {toPersianNumber(stats?.active_projects ?? 0)}
            </span>{" "}
            پروژه فعال
          </p>
        ),
      },
      {
        id: 3,
        title: "میانگین پیشرفت",
        value: isLoading ? "..." : `${toPersianNumber(stats?.avg_progress ?? 0)}٪`,
        unit: "",
        icon: <BarChart3 className="h-5 w-5" />,
        iconClass: "bg-purple-50 text-purple-600",
        footer: (
          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-500 rounded-full transition-all"
              style={{ width: `${Math.min(stats?.avg_progress ?? 0, 100)}%` }}
            />
          </div>
        ),
      },
      {
        id: 4,
        title: "کل سود پرداخت‌شده",
        value: isLoading ? "..." : fmt(stats?.total_profit_paid ?? 0),
        unit: "تومان",
        icon: <TrendingUp className="h-5 w-5" />,
        iconClass: "bg-green-50 text-green-600",
        footer: (
          <p className="text-xs text-green-600 font-medium">
            پرداخت‌شده به سرمایه‌گذاران
          </p>
        ),
      },
    ];
  }, [data, isLoading]);

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {statistics.map((item) => (
        <StatisticCard
          key={item.id}
          title={item.title}
          value={item.value}
          unit={item.unit}
          icon={item.icon}
          iconClass={item.iconClass}
          footer={item.footer}
        />
      ))}
    </section>
  );
}

