import { cn } from "@/lib/utils";

export function NotificationCard({
  title,
  description,
  time,
  badge,
  className,
}: NotificationCard) {
  return (
    <div
      className={cn(
  "relative rounded-xl border border-r-4 p-4 sm:p-5",
  className
)}
    >
     <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between mb-2">
        <h3 className="text-sm md:text-base font-bold text-gray-800">
          {title}
        </h3>

        <span className={badge.className}>
          {badge.text}
        </span>
      </div>

      <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3">
        {description}
      </p>

      <span className="text-[10px] text-gray-400 block text-left">
        {time}
      </span>
    </div>
  );
}