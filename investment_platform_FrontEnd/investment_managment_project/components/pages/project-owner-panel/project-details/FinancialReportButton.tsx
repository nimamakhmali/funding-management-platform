import clsx from "clsx";
import { File} from "lucide-react";

export default function FinancialReportButton() {
  return (
    <button
      className={clsx(
        "Financial-Report-Button",
        "flex items-center gap-2 px-5 h-11 rounded-xl border border-gray-200 bg-white text-primary text-sm font-medium transition-all cursor-pointer",
      )}
    >
      <File  />
      <span>مشاهده گزارش مالی</span>
    </button>
  );
}
