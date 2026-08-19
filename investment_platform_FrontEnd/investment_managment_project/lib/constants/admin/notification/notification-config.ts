import {
  BadgeCheck,
  CircleAlert,
  MessageSquareDot,
  TrendingUp,
} from "lucide-react";

export const notificationConfig = {
  project: {
    icon: BadgeCheck,
    iconClassName: "bg-primary/10 text-primary",
    indicatorClassName: "bg-primary",
  },

  finance: {
    icon: TrendingUp,
    iconClassName: "bg-emerald-100 text-emerald-600",
    indicatorClassName: "bg-emerald-500",
  },

  system: {
    icon: CircleAlert,
    iconClassName: "bg-amber-100 text-amber-600",
    indicatorClassName: "bg-amber-500",
  },

  message: {
    icon: MessageSquareDot,
    iconClassName: "bg-sky-100 text-sky-600",
    indicatorClassName: "bg-sky-500",
  },
} as const;