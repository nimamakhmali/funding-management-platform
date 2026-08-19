import {
  Wallet,
  Rocket,
  CreditCard,
  Users,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { AdminDashboardCardProps } from "@/lib/types/admin/admin-dashboard/AdminDashboardCard";

export const DASHBOARD_CARDS: AdminDashboardCardProps[] = [
  {
    title: "مجموع سرمایه‌گذاری‌ها",
    value: "۱۲۰,۰۰۰,۰۰۰",
    unit: "تومان",

    icon: <Wallet />,
    iconClassName: "bg-primary/10 text-primary",

    badge: {
      value: "۵٪",
      icon: <TrendingUp />,
      className: "text-blue-600",
    },
  },

  {
    title: "پروژه‌های فعال",
    value: 45,
    unit: "پروژه",

    icon: <Rocket />,
    iconClassName: "bg-primary/10 text-primary",

    badge: {
      value: "۰٪",
      icon: <Minus />,
      className: "text-gray-500",
    },
  },

  {
    title: "کل سرمایه‌گذاران",
    value: "۱,۲۵۰",
    unit: "نفر",

    icon: <Users />,
    iconClassName: "bg-primary/10 text-primary",

    badge: {
      value: "۱۲٪",
      icon: <TrendingUp />,
      className: "text-blue-600",
    },
  },

  {
    title: "درآمد سیستم",
    value: "۸۵۰,۰۰۰,۰۰۰",
    unit: "تومان",

    icon: <CreditCard />,
    iconClassName: "bg-primary/10 text-primary",

    badge: {
      value: "۸٪",
      icon: <TrendingUp />,
      className: "text-blue-600",
    },
  },
];