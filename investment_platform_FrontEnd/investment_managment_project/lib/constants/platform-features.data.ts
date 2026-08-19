import { ShieldCheck, Eye } from "lucide-react";
import { PlatformFeature } from "@/lib/types/platform-feature";

export const platformFeatures: PlatformFeature[] = [
  {
    title: "امنیت نهادینه",
    description: "استفاده از سیستم‌های پیشرفته رمزنگاری و حفاظت از داده‌ها.",
    icon: ShieldCheck,
  },
  {
    title: "شفافیت لحظه‌ای",
    description: "دسترسی کامل به گزارش‌های مالی و پیشرفت پروژه‌ها.",
    icon: Eye,
  },
];