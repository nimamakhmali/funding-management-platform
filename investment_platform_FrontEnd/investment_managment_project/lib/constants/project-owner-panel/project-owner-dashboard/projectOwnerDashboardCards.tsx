import {
  TrendingUp,
  CircleDollarSign,
  WalletMinimal,
  Percent,
} from "lucide-react";

import { ProjectOwnerDashboardCards } from "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerDashboardCards";

export const PROJECT_OWNER_DASHBOARD_CARDS: ProjectOwnerDashboardCards [] = [
  {
    title: "کل سرمایه جذب‌شده",
    value: "۱۸,۰۰۰,۰۰۰,۰۰۰",
    unit: "تومان",
    description: "۱۲٪ رشد نسبت به ماه گذشته",

    icon: <CircleDollarSign />,
    iconClassName: "bg-primary/5 text-primary",
  },

  {
    title: "سود پیش‌بینی‌شده",
    value: "۴۵,۰۰۰,۰۰۰,۰۰۰",
    unit: "تومان",
    description: "بر اساس طرح‌های فعال",

    icon: <TrendingUp />,
    iconClassName: "bg-primary/5 text-primary",
  },

  {
    title: "سود تحقق‌یافته",
    value: "۱۲۵,۰۰۰,۰۰۰,۰۰۰",
    unit: "تومان",
    description: "واریز شده به حساب",

    icon: <WalletMinimal />,
    iconClassName: "bg-primary/5 text-primary",
  },

  {
    title: "بازده کل (ROI)",
    value: "۲۴.۵٪",
    description: "میانگین تمام طرح‌ها",

    icon: <Percent />,
    iconClassName: "bg-primary/5 text-primary",

    badge: {
      text: "+۲.۱٪",
      className: "bg-primary/10 text-primary",
    },
  },
];