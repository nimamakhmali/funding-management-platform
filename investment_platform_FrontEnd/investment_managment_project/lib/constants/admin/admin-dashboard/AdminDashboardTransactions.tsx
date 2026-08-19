import { User } from "lucide-react";

import { AdminDashboardTransaction } from "@/lib/types/admin/admin-dashboard/AdminDashboardTransaction";

export const ADMIN_DASHBOARD_TRANSACTIONS: AdminDashboardTransaction[] = [
  {
    id: 1,
    transactionId: "TRX-8932",
    user: {
      name: "رضا کیانی",
      avatar: <User className="h-4 w-4" />,
    },
    operation: "سرمایه‌گذاری جدید",
    amount: 50000000,
    date: "۱۴۰۳/۰۶/۱۵",
    status: "completed",
  },

  {
    id: 2,
    transactionId: "TRX-8931",
    user: {
      name: "سروش جهانگیریان",
      avatar: <User className="h-4 w-4" />,
    },
    operation: "برداشت وجه",
    amount: 12500000,
    date: "۱۴۰۳/۰۶/۱۴",
    status: "pending",
  },

  {
    id: 3,
    transactionId: "TRX-8930",
    user: {
      name: "محمد حسینی",
      avatar: <User className="h-4 w-4" />,
    },
    operation: "سود سهام",
    amount: 3200000,
    date: "۱۴۰۳/۰۶/۱۴",
    status: "completed",
  },
];