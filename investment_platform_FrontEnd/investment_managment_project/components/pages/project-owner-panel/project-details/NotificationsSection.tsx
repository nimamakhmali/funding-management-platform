// components/pages/project-owner-panel/project-details/NotificationsSection.tsx
"use client";

import { useNotifications } from "@/lib/hooks/useNotifications";
import { formatPersianDate } from "@/lib/utils/messages/formatPersianDate";
import { NotificationCard } from "./NotificationCard";

// ── نگاشت نوع اعلان بک‌اند به آیکون/رنگ ─────────────────────────────────────
const TYPE_MAP = {
  INFO: { icon: "info", className: "bg-blue-50 text-blue-600" },
  WARNING: { icon: "warning", className: "bg-yellow-50 text-yellow-600" },
  SUCCESS: { icon: "check_circle", className: "bg-green-50 text-green-600" },
  ERROR: { icon: "error", className: "bg-red-50 text-red-600" },
} as const;

export function NotificationsSection() {
  const { data, isLoading } = useNotifications({ page: 1, page_size: 5 });

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white shadow-sm p-4 animate-pulse">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-12 bg-gray-100 rounded-lg mb-3" />
        ))}
      </div>
    );
  }

  const notifications = data?.results ?? [];

  if (!notifications.length) {
    return (
      <div className="rounded-2xl bg-white shadow-sm p-5 text-center text-sm text-gray-400">
        اعلانی وجود ندارد
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white shadow-sm p-4 sm:p-5 flex flex-col gap-4">
      {notifications.map((item) => (
        <NotificationCard
          key={item.id}
          title={item.title}
          description={item.message}
          time={formatPersianDate(item.created_at)}
          badge={{
            text: TYPE_MAP[item.type].icon,
            className: TYPE_MAP[item.type].className,
          }}
        />
      ))}
    </div>
  );
}