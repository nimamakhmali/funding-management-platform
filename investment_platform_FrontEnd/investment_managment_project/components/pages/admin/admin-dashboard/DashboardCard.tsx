import { AdminDashboardCardProps } from "@/lib/types/admin/admin-dashboard/AdminDashboardCard";
import { cn } from "@/lib/utils";

export default function DashboardCard({
  title,
  value,
  unit,
  icon,
  iconClassName,
  badge,
}: AdminDashboardCardProps ) {
  return (
    <div
      className={cn(
        "rounded-xl border border-gray-50 bg-white p-6",
        "shadow-sm transition-all duration-300 hover:shadow-md"
      )}
    >
      <div className="mb-5 flex items-start justify-between">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-xl transition-colors",
            iconClassName
          )}
        >
          {icon}
        </div>

        {badge && (
          <div
            className={cn(
              "flex items-center gap-1 text-sm font-bold",
              badge.className
            )}
          >
            {badge.icon}
            <span>{badge.value}</span>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-gray-800">
          {title}
        </p>

        <h3 className="flex items-end gap-1 text-2xl font-black tracking-tight text-text-main">
          <span>{value}</span>

          {unit && (
            <span className="text-sm font-medium text-gray-800">
              {unit}
            </span>
          )}
        </h3>
      </div>
    </div>
  );
}