import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";

type AdminPlatformField = {
  name: keyof AdminSettingsFormValues;
  label: string;
  placeholder: string;
  type?: "text" | "email" | "password" | "number";
  dir?: "rtl" | "ltr";
  nuSeparator?: boolean;
};

export const ADMIN_PLATFORM_FIELDS: AdminPlatformField[] = [
  {
    name: "platformName",
    label: "نام پلتفرم (فارسی)",
    placeholder: "نام پلتفرم را وارد کنید",
  },
  {
    name: "supportEmail",
    label: "ایمیل پشتیبانی",
    placeholder: "support@example.com",
    type: "email",
    dir: "ltr",
  },
  {
    name: "paymentApiKey",
    label: "شناسه API پرداخت",
    placeholder: "**************",
    type: "password",
    dir: "ltr",
  },
  {
    name: "sessionDuration",
    label: "مدت زمان اعتبار نشست (دقیقه)",
    placeholder: "30",
    type: "number",
    nuSeparator: true,
  },
];