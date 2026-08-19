"use client";

import { ReactNode } from "react";
import {
  Landmark,
  TrendingUp,
  Sigma,
  CheckCircle,
} from "lucide-react";

export type StatisticItem = {
  id: number;
  title: string;
  value: string;
  unit?: string;
  icon: ReactNode;
  iconClass: string;
  footer: ReactNode;
};

export const statistics: StatisticItem[] = [
  {
    id: 1,
    title: "سرمایه جذب‌شده",
    value: "12.4",
    unit: "م تومان",

    icon: <Landmark className="h-5 w-5" />,

    iconClass:
      "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white",

    footer: (
      <p className="text-xs font-medium text-primary">
        +15% نسبت به ماه قبل
      </p>
    ),
  },

  {
    id: 2,
    title: "سود تحقق‌یافته",
    value: "850",
    unit: "میلیون",

    icon: <TrendingUp className="h-5 w-5" />,

    iconClass:
      "bg-primary-50 text-primary-600 group-hover:bg-blue-600 group-hover:text-white",

    footer: (
      <p className="text-xs font-medium text-text-muted">
        پایدار و بدون تغییر
      </p>
    ),
  },

  {
    id: 3,
    title: "میانگین تأمین مالی",
    value: "68%",

    icon: <Sigma className="h-5 w-5" />,

    iconClass:
      "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",

    footer: (
      <div className="h-1.5 overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: "68%",
          }}
        />
      </div>
    ),
  },

  {
    id: 4,
    title: "وضعیت کلی",
    value: "فعال و در جریان",

    icon: <CheckCircle className="h-5 w-5" />,

    iconClass:
      "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",

    footer: (
      <p className="text-xs text-text-muted">
        3 پروژه فعال، 1 تکمیل شده
      </p>
    ),
  },
];