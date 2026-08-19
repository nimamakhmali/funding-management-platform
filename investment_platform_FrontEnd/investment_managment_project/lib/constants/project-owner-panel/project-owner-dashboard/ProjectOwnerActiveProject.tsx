import { Building } from "lucide-react";
import { ProjectOwnerActiveProject } from 
"@/lib/types/project-owner-panel/project-owner-dashboard/ProjectOwnerActiveProject";

export const PROJECT_OWNER_ACTIVE_PROJECT: ProjectOwnerActiveProject = {
  title: "تجهیز و توسعه صنایع فولاد مکران",
  code: "MKR-402-09",
  progress: 75,
  targetPercent: 75,
  status: "در حال جذب",
  icon: <Building size={36} />,
  stats: [
    {
      label: "مبلغ هدف",
      value: "۵۰,۰۰۰,۰۰۰,۰۰۰",
      unit: "ریال",
    },

    {
      label: "جذب شده",
      value: "۳۷,۵۰۰,۰۰۰,۰۰۰",
      unit: "ریال",
      valueClassName: "text-primary",
    },

    {
      label: "سرمایه‌گذاران",
      value: "۱۲۴ نفر",
    },

    {
      label: "باقیمانده",
      value: "۱۲ روز",
    },
  ],
};