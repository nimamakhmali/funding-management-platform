import { events } from "@/lib/constants/project-owner-panel/project-details/event-data";
import { UpcomingEventCard } from "./UpcomingEventCard";
import { Calendar1Icon } from "lucide-react"

export function UpcomingEventsSection() {
  return (
    <div className="relative overflow-hidden rounded-2xl p-4 sm:p-6 text-primary shadow-lg">
      <div className="absolute top-0 left-0 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full" />

      <div className="relative z-10">
       <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-base sm:text-lg font-bold">
            رویدادهای پیش‌رو
          </h3>
       <Calendar1Icon />
         
        </div>

        <div className="space-y-4">
          {events.map((event) => (
            <UpcomingEventCard
              key={event.title}
              {...event}
            />
          ))}
        </div>

       <button className="mt-5 sm:mt-6 w-full rounded-lg bg-primary text-white py-2.5 sm:py-2 text-sm font-bold shadow-lg shadow-primary/25 transition-colors hover:bg-primary/90">
          افزودن رویداد جدید
        </button>
      </div>
    </div>
  );
}