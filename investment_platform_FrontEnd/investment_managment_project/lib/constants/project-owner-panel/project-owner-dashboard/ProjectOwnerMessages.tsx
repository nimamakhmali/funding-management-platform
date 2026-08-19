import {
  Mail,
  Info,
} from "lucide-react";

import { ProjectOwnerMessage } from "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerMessage";

export const PROJECT_OWNER_MESSAGES: ProjectOwnerMessage[] = [
  {
    id: 1,
    title: "تایید مدارک طرح فولاد",
    description:
      "مدارک ارسالی شما بررسی و تایید شد. لطفا جهت تکمیل فرآیند نهایی...",
    time: "۱۰ دقیقه پیش",
    icon: <Mail />,
    isUnread: true,
    iconClassName:
      "bg-primary/10 text-primary",
  },

  {
    id: 2,
    title: "بروزرسانی قوانین پلتفرم",
    description:
      "کاربر گرامی، قوانین مربوط به برداشت وجه و کارمزدها بروزرسانی شده است.",
    time: "دیروز، ۱۴:۳۰",
    icon: <Info />,
    isUnread: false,
    iconClassName:
      "bg-slate-100 text-slate-400",
  },
];