import { UserPlus, Search, CreditCard, PiggyBank } from "lucide-react";
import { IconType } from "@/lib/types/icon";

export const investmentSteps: {
  id: number;
  title: string;
  description: string;
  icon: IconType;
}[] = [
  {
    id: 1,
    title: "ثبت‌نام",
    description: "ایجاد حساب کاربری و احراز هویت",
    icon: UserPlus,
  },
  {
    id: 2,
    title: "انتخاب طرح",
    description: "بررسی و انتخاب پروژه مناسب",
    icon: Search,
  },
  {
    id: 3,
    title: "سرمایه‌گذاری",
    description: "پرداخت آنلاین و ثبت سرمایه",
    icon: CreditCard,
  },
  {
    id: 4,
    title: "دریافت سود",
    description: "واریز سود در بازه‌های زمانی مشخص",
    icon: PiggyBank,
  },
];