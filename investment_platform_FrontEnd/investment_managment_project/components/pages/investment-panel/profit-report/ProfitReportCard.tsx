import { ProfitReportCardProps } from "@/lib/types/investment-panel/profit-report/profit-report-type";
import { cn } from "@/lib/utils";

export function ProfitReportCard({
  title,
  value,
  unit,
  icon,
  iconClassName,
  badge,
  bottomBarClassName,
}: ProfitReportCardProps) {
  return (
    <div
      className={cn(
        "profit-report-card",
        "bg-white p-7 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 relative overflow-hidden hover:shadow-md transition-shadow",
      )}
    >
      <div className="flex justify-between items-center">
        <div className={iconClassName}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>

        {badge && (
          <span className={badge.className}>
            {badge.icon && (
              <span className="material-symbols-outlined text-sm mr-1">
                {badge.icon}
              </span>
            )}
            {badge.text}
          </span>
        )}
      </div>

      <div>
        <p className="text-text-sub text-[13px] font-bold mb-2 uppercase tracking-wide text-gray-400">
          {title}
        </p>

        <h3 className="text-2xl font-black  tabular-nums leading-none">
          {value}

          {unit && (
            <span className="text-base font-bold text-text-sub mr-1 text-gray-400">
              {unit}
            </span>
          )}
        </h3>
      </div>

      {bottomBarClassName && (
        <div
          className={`absolute bottom-0 right-0 left-0 h-1.5 ${bottomBarClassName}`}
        />
      )}
    </div>
  );
}
