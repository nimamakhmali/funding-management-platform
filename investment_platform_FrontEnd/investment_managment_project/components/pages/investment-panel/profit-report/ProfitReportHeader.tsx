import { cn } from "@/lib/utils";
import ProfitReportGetExcelButton from "./ProfitReportGetExcelButton";
import ProfitReportPrintResult from "./ProfitReportPrintResult";

export default function ProfitReportHeader() {
  return (
    <header
      className={cn(
        "profit-header",
        "flex flex-col md:flex-row md:items-end md:justify-between gap-4",
      )}
    >
      <div>
        <h1 className="text-2xl md:text-[32px] font-black text-text-main mb-2 heading-tight">
          گزارش سود
        </h1>
        <p className="text-[#6b7280] text-sm md:text-base font-medium">
          تحلیل دقیق درآمدهای دوره‌ای و بازدهی پروژه‌های فعال
        </p>
      </div>
      <div className="flex gap-2">
        <ProfitReportGetExcelButton />
        <ProfitReportPrintResult />
      </div>
    </header>
  );
}
