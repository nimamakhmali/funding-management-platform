import { ProjectDetailsCardProps } from "@/lib/types/project-owner-panel/project-details/project-details-types";
import { cn } from "@/lib/utils";

export function ProjectDetailsCard({
  title,
  description,
  icon,
  iconClassName,
  badge,
  date
}: ProjectDetailsCardProps) {
  return (
    <div
      className={cn(
        "profit-report-card",
        "bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6 relative overflow-hidden hover:shadow-md transition-shadow",
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
        <p className="text-gray-400 text-[13px] font-bold mb-1 uppercase tracking-wide ">
          {title}
        </p>
            <span className="text-base font-bold text-text-sub mr-1 text-text-main">
             {description}
            </span>
      </div>
       <div className=" pt-4 border-t border-t-gray-100 flex justify-between items-center text-sm">
         <span className="text-slate-400">تاریخ ایجاد</span>
          {date}
       </div>
    </div>
    
  );
}
