import { AdminSettingsFormValues } from "@/lib/types/admin/admin-account-settings/AdminSetting";

type AdminFinanceField = {
  name: keyof AdminSettingsFormValues;
  label: string;
  placeholder: string;
  description: string;
  suffix: string;
};

export const ADMIN_FINANCE_FIELDS: AdminFinanceField[] = [
  {
    name: "minimumInvestment",
    label: "حداقل سرمایه‌گذاری",
    placeholder: "۵,۰۰۰,۰۰۰",
    description: "حداقل مبلغ ورودی برای هر پروژه",
    suffix: "تومان",
  },

  {
    name: "dailyWithdrawLimit",
    label: "سقف برداشت روزانه",
    placeholder: "۵۰,۰۰۰,۰۰۰",
    description: "مجموع برداشت‌های کاربر در ۲۴ ساعت",
    suffix: "تومان",
  },

  {
    name: "transactionFee",
    label: "کارمزد تراکنش",
    placeholder: "۱.۵",
    description: "درصد کسر شده از هر سود پرداختی",
    suffix: "%",
  },
];