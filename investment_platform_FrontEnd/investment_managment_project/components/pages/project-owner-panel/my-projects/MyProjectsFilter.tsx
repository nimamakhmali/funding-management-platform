"use client";

import { useState } from "react";
import { Filter, SortAsc } from "lucide-react";
import MyProjectsFilterSheet from "./MyProjectsFilterSheet";
import { useMyProjects } from "@/lib/hooks/useOwnerDashboard";

export default function MyProjectsFilter() {
  const [open, setOpen] = useState(false);
  const { data } = useMyProjects({ page: 1, page_size: 1 });

  const total = data?.count ?? 0;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 justify-between bg-white p-2 rounded-xl border border-gray-100 mt-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg hover:bg-slate-50 hover:text-primary border border-slate-200 transition-colors whitespace-nowrap shadow-sm"
          >
            <Filter />
            <span>فیلترها</span>
          </button>

          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 bg-white rounded-lg hover:bg-slate-50 hover:text-primary border border-slate-200 transition-colors whitespace-nowrap shadow-sm">
            <SortAsc />
            <span>مرتب‌سازی</span>
          </button>
        </div>

        <div className="text-xs text-text-muted flex items-center px-2">
          {total > 0
            ? `نمایش ${total.toLocaleString("fa-IR")} پروژه`
            : "پروژه‌ای یافت نشد"}
        </div>
      </div>

      <MyProjectsFilterSheet open={open} onOpenChange={setOpen} />
    </>
  );
}