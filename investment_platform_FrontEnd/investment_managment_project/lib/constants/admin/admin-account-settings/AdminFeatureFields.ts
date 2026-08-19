import {
  Bolt,
  CirclePlus,
  Headphones,
  Mail,
} from "lucide-react";

import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";

type AdminFeatureField = {
  name:
    | "instantDeposit"
    | "createProject"
    | "sms2FA"
    | "liveSupport";

  title: string;
  description: string;
  icon: React.ElementType;
};

export const ADMIN_FEATURE_FIELDS: AdminFeatureField[] = [
  {
    name: "instantDeposit",
    title: "واریز آنی",
    description:
      "تأیید خودکار تراکنش‌های بانکی بلافاصله پس از پرداخت",
    icon: Bolt,
  },

  {
    name: "createProject",
    title: "ثبت پروژه جدید",
    description:
      "امکان تعریف و بارگذاری پروژه‌های سرمایه‌گذاری توسط اپراتورها",
    icon: CirclePlus,
  },

  {
    name: "sms2FA",
    title: "احراز هویت پیامکی (۲FA)",
    description:
      "اجباری کردن کد تأیید پیامکی برای ورود به پنل و برداشت وجه",
    icon: Mail,
  },

  {
    name: "liveSupport",
    title: "چت آنلاین پشتیبانی",
    description:
      "نمایش ویجت گفت‌وگو با پشتیبانی در پلتفرم کاربر",
    icon: Headphones,
  },
];