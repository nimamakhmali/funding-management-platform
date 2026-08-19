import {
  Package,
  Bolt,
} from "lucide-react";

import { ProjectOwnerStatsCard } from 
"@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerStatsCard";

export const PROJECT_OWNER_STATS_CARDS: ProjectOwnerStatsCard[] = [
  {
    title: "کل طرح‌های ثبت شده",
    value: "۱۲ طرح",
    icon: <Package />,
    iconClassName:
      "bg-slate-50 text-slate-400",
    titleClassName:
      "text-text-secondary",
    cardClassName:
      "",
  },

  {
    title: "طرح‌های فعال و جاری",
    value: "۳ طرح",
    icon: <Bolt />,
    iconClassName:
      "bg-primary/5 text-primary",
    titleClassName:
      "text-primary",
    cardClassName:
      "border-r-4 border-r-primary",
  },
];