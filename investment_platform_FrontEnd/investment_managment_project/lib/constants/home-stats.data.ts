import { ShieldCheck, Activity, TrendingUp, LifeBuoy } from "lucide-react";
import { HomeStat } from "@/lib/types/home-stats";

export const homeStats: HomeStat[] = [
  {
    id: 1,
    title: "امنیت سرمایه",
    label: "حفاظت چند لایه از دارایی ها",
    icon: ShieldCheck,
  },
  {
    id: 2,
    title: "شفافیت کامل",
    label: "گزارش دهی لحظه ای و دقیق",
    icon: Activity,
  },
  {
    id: 3,
    title: "سود آوری بالا",
    label: "بهینه ترین نرخ بازدهی سالانه",
    icon: TrendingUp,
  },
  {
    id: 4,
    title: "پشتیبانی 24/7",
    label: "همراهی گام به گام با شما",
    icon: LifeBuoy,
  },
];