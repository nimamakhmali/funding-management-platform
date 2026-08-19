import {
  BadgeCheck,
  TrendingUp,
  CircleAlert,
  MessageSquareDot,
} from "lucide-react";

import { Notification } from "@/lib/types/admin/notification/notification-types";

export const notifications: Notification[] = [
  {
    id: 1,

    title: "تأیید پروژه",

    description:
      "پروژه شما توسط مدیریت سامانه تأیید شد.",

    type: "project",

    icon: BadgeCheck,

    read: false,

    createdAt: "۲ ساعت پیش",

    action: {
      label: "مشاهده جزئیات",
      href: "/",
    },
  },

  {
    id: 2,

    title: "تغییر وضعیت تأمین مالی",

    description:
      "وضعیت تأمین مالی پروژه شما به‌روزرسانی شد.",

    type: "finance",

    icon: TrendingUp,

    read: false,

    createdAt: "۵ ساعت پیش",

    action: {
      label: "مشاهده گزارش",
      href: "/",
    },
  },

  {
    id: 3,

    title: "رد پروژه",

    description:
      "پروژه شما نیاز به اصلاح دارد.",

    type: "system",

    icon: CircleAlert,

    read: true,

    createdAt: "دیروز",

    action: {
      label: "بررسی ایرادات",
      href: "/",
    },
  },

  {
    id: 4,

    title: "پیام جدید از ادمین",

    description:
      "پیام جدیدی از مدیریت دریافت کرده‌اید.",

    type: "message",

    icon: MessageSquareDot,

    read: true,

    createdAt: "۲ روز پیش",

    action: {
      label: "پاسخ به پیام",
      href: "/",
    },
  },
];