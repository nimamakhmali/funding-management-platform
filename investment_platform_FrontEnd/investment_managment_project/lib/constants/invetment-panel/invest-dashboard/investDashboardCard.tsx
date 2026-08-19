import { TrendingUp } from "lucide-react";
import { DashboardCardProps } from "@/lib/types/investment-panel/invest-dashboard/InvestDashboardCard";

export const dashboardCardsData: DashboardCardProps[] = [

    {
        title: "موجودی کل",
        value: "۲,۵۰۰,۰۰۰,۰۰۰",
        unit: "ریال",
        change: "۵.۲٪",
        icon: TrendingUp,
        progress: 85,
        variant: "success"
    },


    {
        title: "سود روزانه",
        value: "۱۲,۵۰۰,۰۰۰",
        unit: "ریال",
        change: "۱.۸٪",
        icon: TrendingUp,
        progress: 60,
        variant: "success"
    },


    {
        title: "سرمایه‌گذاری‌های فعال",
        value: 12,
        unit: "پروژه",
        status: "بدون تغییر",
        icon: TrendingUp,
        progress: 40,
        variant: "neutral"
    }

];