import { AdminAuditLog } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogTable";

export const auditLogData: AdminAuditLog[] = [
  {
    id: "88429",
    type: "balance",
    description: "به‌روزرسانی سقف برداشت روزانه",

    user: {
      id: "1",
      name: "رضا علوی",
      initials: "ر.ع",
    },

    createdAt: "۱۴۰۲/۰۸/۰۵ - ۱۴:۳۲:۱۰",
  },

  {
    id: "88430",
    type: "setting",
    description: "اصلاح نرخ کارمزد تراکنش‌ها",

    user: {
      id: "2",
      name: "علی محمدی",
      initials: "ع.م",
    },

    createdAt: "۱۴۰۲/۰۸/۰۵ - ۱۲:۰۵:۴۴",
  },

  {
    id: "88431",
    type: "delete-user",
    description: "غیرفعال‌سازی دسترسی واحد نظارت",

    user: {
      id: "3",
      name: "سارا مقدم",
      initials: "س.م",
    },

    createdAt: "۱۴۰۲/۰۸/۰۴ - ۰۹:۱۵:۲۲",
  },
];