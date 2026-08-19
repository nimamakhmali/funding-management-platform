import { Button } from "@/components/ui/button";

import AdminDashboardAlertItem from "./AdminDashboardAlertItem";

import { ADMIN_DASHBOARD_ALERTS } from "@/lib/constants/admin/admin-dashboard/AdminDashboardAlerts";

export default function AdminDashboardAlerts() {
  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-bold text-text-main">
          هشدارهای سیستم
        </h2>

        <span className="rounded-md bg-background px-2 py-1 text-xs font-medium text-gray-700">
          {ADMIN_DASHBOARD_ALERTS.length} مورد جدید
        </span>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {ADMIN_DASHBOARD_ALERTS.map((alert) => (
          <AdminDashboardAlertItem
            key={alert.id}
            {...alert}
          />
        ))}
      </div>

      <Button
        variant="outline"
        className="mt-6 text-primary"
      >
        مشاهده همه هشدارها
      </Button>
    </div>
  );
}