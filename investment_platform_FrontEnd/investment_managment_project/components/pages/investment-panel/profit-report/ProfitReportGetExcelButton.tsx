"use client";
import { Download } from "lucide-react";

export default function ProfitReportGetExcelButton() {
  return (
    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-lg text-text-main text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
      <Download />
      دریافت اکسل
    </button>
  );
}
