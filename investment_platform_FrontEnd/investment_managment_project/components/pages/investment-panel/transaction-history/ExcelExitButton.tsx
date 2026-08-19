import clsx from "clsx";
import { Download } from "lucide-react";

export default function ExcelExitButton() {
  return (
    <button
      className={clsx(
        "excel-exit-button",
        "flex items-center gap-2 px-5 h-11 rounded-xl border border-gray-200 bg-white text-text-main text-sm font-medium hover:bg-gray-50 transition-all cursor-pointer",
      )}
    >
      <Download />
      <span>خروجی اکسل</span>
    </button>
  );
}
