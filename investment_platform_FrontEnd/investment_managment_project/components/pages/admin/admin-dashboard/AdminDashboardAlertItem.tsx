import { cn } from "@/lib/utils";
import { AdminDashboardAlertProps } from "@/lib/types/admin/admin-dashboard/AdminDashboardAlert";

export default function AdminDashboardAlertItem({
  title,
  description,
  time,
  icon,
  iconClassName,
}: AdminDashboardAlertProps) {
  return (
    <div
      className={cn(
        "flex cursor-pointer gap-3 rounded-xl border border-gray-100 p-3",
        "duration-200"
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
          iconClassName
        )}
      >
        {icon}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-bold text-text-main">
            {title}
          </h3>

          <span className="shrink-0 text-[10px] font-medium text-gray-700">
            {time}
          </span>
        </div>

        <p className="mt-1 line-clamp-1 text-xs text-gray-700">
          {description}
        </p>
      </div>
    </div>
  );
}