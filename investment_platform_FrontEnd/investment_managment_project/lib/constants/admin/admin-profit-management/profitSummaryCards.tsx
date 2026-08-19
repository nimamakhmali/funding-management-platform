import { Calendar, Clock, CreditCard } from "lucide-react";
import { ProfitSummaryCard } from "@/lib/types/admin/admin-profit-management/ProfitSummaryCard-types";


export const profitSummaryCards: ProfitSummaryCard[] = [
  {
    title: "مجموع سود در انتظار تایید",
    value: 45000000000,
    unit: "ریال",
    description: "۱۲٪ افزایش نسبت به ماه قبل",
    icon: <Clock className="size-5" />,
    highlighted: true,
  },
  {
    title: "تعداد دوره‌های فعال",
    value: 12,
    unit: "دوره مالی",
    description: "در حال پردازش سیستمی",
    icon: <Calendar className="size-5" />,
  },
  {
    title: "سود توزیع شده ماه جاری",
    value: 120000000000,
    unit: "ریال",
    description: "تمامی پرداخت‌ها موفق",
    icon: <CreditCard className="size-5" />,
    highlighted: true,
  },
];