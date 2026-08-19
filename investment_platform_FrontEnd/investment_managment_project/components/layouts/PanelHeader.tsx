"use client";

import { useState, useEffect } from "react";
import { SearchBox } from "../ui/searchbox";
import { Bell, MessageCircle } from "lucide-react";
import { getPersianDate } from "@/lib/utils/date-utils";

export default function PanelHeader() {
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    setDate(getPersianDate());
  }, []);

  return (
    <header className="h-18 flex-shrink-0 w-full bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-20">
      <div className="flex items-center gap-4">
        <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" />
        <h2 className="text-xl font-bold text-gray-800 whitespace-nowrap">
          داشبورد مالی
        </h2>
        <div className="h-6 w-px bg-gray-300 hidden md:block" />
        <p className="text-gray-500 text-sm hidden md:block">
          {date}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SearchBox onBlur={() => {}} />
        <button className="size-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors relative">
          <Bell className="w-5 h-5" />
        </button>
        <button className="size-10 flex items-center justify-center rounded-xl hover:bg-gray-100 text-gray-500 hover:text-purple-600 transition-colors">
          <MessageCircle className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}