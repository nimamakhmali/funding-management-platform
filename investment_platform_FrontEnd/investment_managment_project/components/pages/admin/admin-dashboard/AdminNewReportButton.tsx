"use client";
import { Plus } from "lucide-react";
export default function AdminNewReportButton() {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-primary border border-gray-200 rounded-lg text-gray-50 text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
     <Plus />
      دریافت خروجی
    </button>
  );
}
