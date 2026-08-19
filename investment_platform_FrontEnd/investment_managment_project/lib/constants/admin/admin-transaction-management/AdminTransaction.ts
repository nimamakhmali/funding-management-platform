import { AdminTransaction } from "@/lib/types/admin/admin-transaction-management/AdminTransaction-types";

export const transactionTableData: AdminTransaction[] = [
  {
    id: "TX-۹۸۴۲۱",
    user: {
      name: "رضا کیانی",
      initials: "ر.ک",
    },
    type: "سرمایه‌گذاری",
    amount: 120000000,
    status: "success",
    date: "۱۴۰۲/۰۹/۱۵ - ۱۲:۳۰",
  },

  {
    id: "TX-۹۸۴۲۰",
    user: {
      name: "سارا احمدی",
      initials: "س.ا",
    },
    type: "برداشت وجه",
    amount: 4500000,
    status: "pending",
    date: "۱۴۰۲/۰۹/۱۵ - ۱۰:۱۵",
  },

  {
    id: "TX-۹۸۴۱۹",
    user: {
      name: "محمد ناصری",
      initials: "م.ن",
    },
    type: "واریز وجه",
    amount: 25000000,
    status: "failed",
    date: "۱۴۰۲/۰۹/۱۴ - ۱۸:۴۵",
  },
];