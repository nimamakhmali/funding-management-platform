import { AdminAuditLogDetails } from "@/lib/types/admin/admin-system-activity-report-management/AdminAuditLogDetailsCard";

export const auditLogDetails: AdminAuditLogDetails = {
  id: "88429",

  changes: {
    before: `"transaction_fee": 0.0025,
"min_deposit": 5000000`,

    after: `"transaction_fee": 0.0035,
"min_deposit": 5000000`,
  },

  actor: {
    name: "علی محمدی",
    role: "مدیر",
    ip: "192.168.1.144",
    browser: "Chrome (Windows 11)",
  },

  metadata: {
    module: "Core Configuration",
    time: "12:05:44:892 ms",
  },
};