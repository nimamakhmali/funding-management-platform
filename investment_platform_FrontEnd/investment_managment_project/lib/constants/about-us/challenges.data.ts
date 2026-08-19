import {
  Scale,
  BarChart3,
  Shield,
  Workflow,
} from "lucide-react";

import { Challenge } from "@/lib/types/challenge";

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "پیچیدگی‌های قانونی",
    description:
      "خودکارسازی انطباق با قوانین بورس و نهادهای نظارتی برای کاهش خطای انسانی.",
    icon: Scale,
  },
  {
    id: 2,
    title: "مدیریت ریسک",
    description:
      "ابزارهای پیشرفته تحلیل و پایش برای شناسایی و کنترل ریسک‌های سرمایه‌گذاری.",
    icon: BarChart3,
  },
  {
    id: 3,
    title: "عدم شفافیت",
    description:
      "ایجاد یک منبع واحد حقیقت برای تمام تراکنش‌ها و گزارش‌ها.",
    icon: Shield,
  },
  {
    id: 4,
    title: "کارایی عملیاتی",
    description:
      "کاهش هزینه‌های سربار و زمان پردازش از طریق یکپارچه‌سازی فرآیندها.",
    icon: Workflow,
  },
];