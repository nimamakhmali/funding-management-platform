import {
  Landmark,
  BriefcaseBusiness,
  Users,
  TrendingUp,
} from "lucide-react";

import { PlatformStat } from "@/lib/types/platform-stats";

export const platformStats: PlatformStat[] = [
  {
    id: 1,
    title: "حجم کل تامین مالی",
    value: 150,
    prefix: "+",
    suffix: "میلیارد تومان",
    icon: Landmark,
  },
  {
    id: 2,
    title: "پروژه موفق",
    value: 45,
    suffix: "پروژه",
    icon: BriefcaseBusiness,
  },
  {
    id: 3,
    title: "سرمایه‌گذار فعال",
    value: 2500,
    prefix: "+",
    suffix: "کاربر",
    icon: Users,
  },
  {
    id: 4,
    title: "میانگین بازدهی",
    value: 18,
    suffix: "% سالانه",
    icon: TrendingUp,
  },
];