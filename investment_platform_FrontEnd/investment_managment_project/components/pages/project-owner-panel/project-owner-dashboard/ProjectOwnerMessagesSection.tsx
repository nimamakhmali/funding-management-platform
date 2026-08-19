"use client";

import { useNotifications } from "@/lib/hooks/useNotifications";
import ProjectOwnerMessageItem from "./ProjectOwnerMessageItem";
import { Bell } from "lucide-react";
import type { ProjectOwnerMessage } from
  "@/lib/types/project-owner-panel/project-owner-dashboard/projectOwnerMessage";

// mapping نوع اعلان به آیکون و رنگ
function mapNotificationToMessage(n: {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}): ProjectOwnerMessage {
  const TYPE_MAP: Record<string, { iconClassName: string }> = {
    INFO:    { iconClassName: "bg-slate-100 text-slate-400" },
    WARNING: { iconClassName: "bg-amber-50 text-amber-500" },
    SUCCESS: { iconClassName: "bg-primary/10 text-primary" },
    ERROR:   { iconClassName: "bg-red-50 text-red-500" },
  };

  const config = TYPE_MAP[n.type] ?? TYPE_MAP.INFO;

  // تبدیل تاریخ به فرمت فارسی ساده
  function relativeTime(dateStr: string): string {
    const diff = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} دقیقه پیش`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ساعت پیش`;
    const days = Math.floor(hours / 24);
    return `${days} روز پیش`;
  }

  return {
    id: Number(n.id.replace(/-/g, "").slice(0, 8)) || Math.random(),
    title: n.title,
    description: n.message,
    time: relativeTime(n.created_at),
    icon: <Bell size={16} />,
    isUnread: !n.is_read,
    iconClassName: config.iconClassName,
  };
}

export default function ProjectOwnerMessagesSection() {
  const { data, isLoading } = useNotifications({ page: 1 });

  // فقط ۵ اعلان اول نمایش داده می‌شود
  const notifications = (data?.results ?? []).slice(0, 5);
  const messages = notifications.map(mapNotificationToMessage);

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-card">
      <div className="flex items-center justify-between border-b border-slate-50 p-5">
        <h3 className="flex items-center gap-2 font-bold text-text-main">
          پیام‌های مدیریت
          {data && data.count > 0 && (
            <span className="rounded-full bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
              {data.count}
            </span>
          )}
        </h3>
        <button className="text-[10px] font-bold text-primary">
          مشاهده همه
        </button>
      </div>

      <div className="divide-y divide-slate-50">
        {isLoading ? (
          // skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-5 animate-pulse space-y-2">
              <div className="h-3 bg-gray-100 rounded w-1/2" />
              <div className="h-3 bg-gray-100 rounded w-3/4" />
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-sm text-text-muted">
            پیامی وجود ندارد
          </div>
        ) : (
          messages.map((message) => (
            <ProjectOwnerMessageItem key={message.id} message={message} />
          ))
        )}
      </div>
    </section>
  );
}