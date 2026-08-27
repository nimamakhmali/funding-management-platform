"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SearchBox } from "../ui/searchbox";
import { Bell, MessageCircle } from "lucide-react";
import { getPersianDate } from "@/lib/utils/date-utils";
import { useNotifications } from "@/lib/hooks/useNotifications";

export default function PanelHeader() {
  const [date, setDate] = useState<string>("");
  const router = useRouter();

  // دریافت تعداد notificationهای خوانده‌نشده
  const { data: notifData } = useNotifications({ page: 1, page_size: 5 });
  const unreadCount =
    notifData?.results?.filter((n) => !n.is_read).length ?? 0;

  useEffect(() => {
    setDate(getPersianDate());
  }, []);

  const handleBellClick = () => {
    router.push("/notification");
  };

  const handleTicketClick = () => {
    router.push("/admin-ticket-manegement");
  };

  return (
    <header className="h-18 flex-shrink-0 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-20">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" />
        <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
          داشبورد مالی
        </h2>
        <div className="h-6 w-px bg-gray-300 hidden md:block" />
        <p className="text-gray-500 text-sm hidden md:block">{date}</p>
      </div>

      <div className="flex items-center gap-3">
        <SearchBox onBlur={() => {}} />

        {/* زنگوله — نوتیفیکیشن */}
        <button
          onClick={handleBellClick}
          title="اعلان‌ها"
          className="size-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors relative"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>

        {/* تیکت‌ها */}
        <button
          onClick={handleTicketClick}
          title="تیکت‌ها"
          className="size-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}