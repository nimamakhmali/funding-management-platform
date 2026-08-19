import { cn } from "@/lib/utils";

export function UpcomingEventCard({
  month,
  day,
  title,
  time,
  active,
}: UpcomingEventCard) {
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex flex-col items-center rounded-lg p-2 min-w-[50px]",

          active
            ? "bg-primary"
            : "bg-primary"
        )}
      >
        <span
          className={cn(
            "text-xs",
            active ? "text-gray-100" : "text-gray-100"
          )}
        >
          {month}
        </span>

        <span
          className={cn(
            "text-lg font-bold",
            active ? "text-white" : "text-gray-100"
          )}
        >
          {day}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <p
  className={cn(
    " text-sm sm:text-base",
    active
      ? "font-bold text-text-main"
      : "font-medium text-gray-800"
  )}
>
          {title}
        </p>

        <p
  className="text-xs sm:text-sm text-gray-700"
>
          {time}
        </p>
      </div>
    </div>
  );
}