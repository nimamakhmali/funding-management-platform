import {
  Info,
  Server,
  TriangleAlert,
} from "lucide-react";

import { AdminDashboardAlertProps } from "@/lib/types/admin/admin-dashboard/AdminDashboardAlert";

export const ADMIN_DASHBOARD_ALERTS: AdminDashboardAlertProps[] = [
  {
    id: 1,
    title: "برداشت در انتظار تایید",
    description:
      "درخواست برداشت وجه از سوی کاربر نیاز به تایید دارد.",
    time: "۲ دقیقه پیش",

    icon: <TriangleAlert />,
    iconClassName: "bg-orange-50 text-orange-600",
  },

  {
    id: 2,
    title: "خطای اتصال درگاه",
    description:
      "اتصال به درگاه پرداخت بانک ملت قطع شده است.",
    time: "۱ ساعت پیش",

    icon: <Server />,
    iconClassName: "bg-red-50 text-red-600",
  },

  {
    id: 3,
    title: "بروزرسانی سیستم",
    description:
      "نسخه جدید پنل مدیریت با موفقیت نصب شد.",
    time: "۳ ساعت پیش",

    icon: <Info />,
    iconClassName: "bg-blue-50 text-primary",
  },
];